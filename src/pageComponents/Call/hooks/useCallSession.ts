'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '@/src/lib/logger';
import { getIceServers } from '@/src/lib/webrtc/iceServers';
import { type CallSignal, useCallSignaling } from './useCallSignaling';

export interface RemoteParticipant {
   userId: string;
   stream: MediaStream | null;
}

interface UseCallSessionOptions {
   conversationId: string;
   authUserId: string;
   callType: 'audio' | 'video';
   participantIds: string[];
   onEnded: () => void;
}

export function useCallSession({
   conversationId,
   authUserId,
   callType,
   participantIds,
   onEnded,
}: UseCallSessionOptions) {
   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
   const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
   const [isMuted, setIsMuted] = useState(false);
   const [isCameraOff, setIsCameraOff] = useState(callType === 'audio');
   const [isSpeakerOff, setIsSpeakerOff] = useState(false);
   const [isConnected, setIsConnected] = useState(false);

   const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
   const localStreamRef = useRef<MediaStream | null>(null);
   const pendingCandidates = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());

   const channelName = `call:${conversationId}`;

   function createPeerConnection(remoteUserId: string, send: (s: CallSignal) => Promise<void>) {
      const servers = getIceServers();
      logger.warn('[call] creating PC for', remoteUserId, 'iceServers:', JSON.stringify(servers));
      const pc = new RTCPeerConnection({ iceServers: servers });

      pc.oniceconnectionstatechange = () => {
         logger.warn('[call] iceConnectionState', remoteUserId, '=', pc.iceConnectionState);
      };
      pc.onicegatheringstatechange = () => {
         logger.warn('[call] iceGatheringState', remoteUserId, '=', pc.iceGatheringState);
      };
      pc.onicecandidateerror = e => {
         logger.warn('[call] icecandidateerror', e.errorCode, e.errorText, e.url);
      };

      pc.onicecandidate = ({ candidate }) => {
         if (candidate) {
            logger.warn('[call] local candidate ->', candidate.type, candidate.protocol);
            send({
               type: 'ice-candidate',
               fromUserId: authUserId,
               toUserId: remoteUserId,
               conversationId,
               callType,
               candidate: candidate.toJSON(),
            });
         } else {
            logger.warn('[call] local candidate gathering complete');
         }
      };

      pc.ontrack = ({ streams }) => {
         setRemoteParticipants(prev => {
            const existing = prev.find(p => p.userId === remoteUserId);
            if (existing) {
               return prev.map(p => (p.userId === remoteUserId ? { ...p, stream: streams[0] } : p));
            }
            return [...prev, { userId: remoteUserId, stream: streams[0] }];
         });
         setIsConnected(true);
      };

      pc.onconnectionstatechange = () => {
         if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setRemoteParticipants(prev => prev.filter(p => p.userId !== remoteUserId));
         }
      };

      if (localStreamRef.current) {
         for (const track of localStreamRef.current.getTracks()) {
            pc.addTrack(track, localStreamRef.current);
         }
      }

      peerConnections.current.set(remoteUserId, pc);
      return pc;
   }

   const { send } = useCallSignaling(channelName, async (signal: CallSignal) => {
      if (signal.fromUserId === authUserId) return;
      if (signal.toUserId && signal.toUserId !== authUserId) return;
      logger.warn('[call] recv signal', signal.type, 'from', signal.fromUserId);

      if (signal.type === 'offer' && signal.sdp) {
         let pc = peerConnections.current.get(signal.fromUserId);
         if (!pc) pc = createPeerConnection(signal.fromUserId, send);

         await pc.setRemoteDescription(signal.sdp);
         const answer = await pc.createAnswer();
         await pc.setLocalDescription(answer);

         const queued = pendingCandidates.current.get(signal.fromUserId) ?? [];
         for (const c of queued) await pc.addIceCandidate(c);
         pendingCandidates.current.delete(signal.fromUserId);

         await send({
            type: 'answer',
            fromUserId: authUserId,
            toUserId: signal.fromUserId,
            conversationId,
            callType,
            sdp: answer,
         });
      }

      if (signal.type === 'answer' && signal.sdp) {
         const pc = peerConnections.current.get(signal.fromUserId);
         if (pc && pc.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(signal.sdp);
            const queued = pendingCandidates.current.get(signal.fromUserId) ?? [];
            for (const c of queued) await pc.addIceCandidate(c);
            pendingCandidates.current.delete(signal.fromUserId);
         }
      }

      if (signal.type === 'ice-candidate' && signal.candidate) {
         const pc = peerConnections.current.get(signal.fromUserId);
         if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(signal.candidate);
         } else {
            const queued = pendingCandidates.current.get(signal.fromUserId) ?? [];
            pendingCandidates.current.set(signal.fromUserId, [...queued, signal.candidate]);
         }
      }

      if (signal.type === 'join') {
         const existing = peerConnections.current.get(signal.fromUserId);
         if (
            existing &&
            existing.connectionState !== 'closed' &&
            existing.connectionState !== 'failed'
         )
            return;
         const pc = createPeerConnection(signal.fromUserId, send);
         const offer = await pc.createOffer();
         await pc.setLocalDescription(offer);
         await send({
            type: 'offer',
            fromUserId: authUserId,
            toUserId: signal.fromUserId,
            conversationId,
            callType,
            sdp: offer,
         });
      }

      if (signal.type === 'decline') {
         if (peerConnections.current.size === 0) {
            onEnded();
         }
      }

      if (signal.type === 'leave' || signal.type === 'end') {
         const pc = peerConnections.current.get(signal.fromUserId);
         if (pc) {
            pc.close();
            peerConnections.current.delete(signal.fromUserId);
         }
         setRemoteParticipants(prev => prev.filter(p => p.userId !== signal.fromUserId));

         if (signal.type === 'end' || peerConnections.current.size === 0) {
            onEnded();
         }
      }
   });

   const startLocalMedia = useCallback(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
         audio: true,
         video: callType === 'video',
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
   }, [callType]);

   const joinCall = useCallback(async () => {
      await send({
         type: 'join',
         fromUserId: authUserId,
         conversationId,
         callType,
      });
   }, [send, authUserId, conversationId, callType]);

   const leaveCall = useCallback(async () => {
      await send({
         type: 'leave',
         fromUserId: authUserId,
         conversationId,
         callType,
      });

      for (const pc of peerConnections.current.values()) pc.close();
      peerConnections.current.clear();

      for (const t of localStreamRef.current?.getTracks() ?? []) t.stop();
      localStreamRef.current = null;
      setLocalStream(null);
      setRemoteParticipants([]);
      onEnded();
   }, [send, authUserId, conversationId, callType, onEnded]);

   const endCallForAll = useCallback(async () => {
      await send({
         type: 'end',
         fromUserId: authUserId,
         conversationId,
         callType,
      });
      await leaveCall();
   }, [send, authUserId, conversationId, callType, leaveCall]);

   const toggleMute = useCallback(() => {
      if (!localStreamRef.current) return;
      for (const track of localStreamRef.current.getAudioTracks()) {
         track.enabled = isMuted;
      }
      setIsMuted(m => !m);
   }, [isMuted]);

   const toggleCamera = useCallback(() => {
      if (!localStreamRef.current) return;
      for (const track of localStreamRef.current.getVideoTracks()) {
         track.enabled = isCameraOff;
      }
      setIsCameraOff(c => !c);
   }, [isCameraOff]);

   const toggleSpeaker = useCallback(() => {
      setIsSpeakerOff(s => !s);
   }, []);

   useEffect(() => {
      return () => {
         for (const pc of peerConnections.current.values()) pc.close();
         for (const t of localStreamRef.current?.getTracks() ?? []) t.stop();
      };
   }, []);

   return {
      localStream,
      remoteParticipants,
      isMuted,
      isCameraOff,
      isSpeakerOff,
      isConnected,
      participantIds,
      startLocalMedia,
      joinCall,
      leaveCall,
      endCallForAll,
      toggleMute,
      toggleCamera,
      toggleSpeaker,
      send,
   };
}
