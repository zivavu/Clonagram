'use client';

import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';
import {
   IoCallOutline,
   IoMicOffOutline,
   IoMicOutline,
   IoVolumeHighOutline,
   IoVolumeMuteOutline,
} from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { sendCallEvent } from '@/src/actions/dm/sendCallEvent';
import UserAvatar from '@/src/components/UserAvatar';
import { supabase } from '@/src/lib/supabase/client';
import { useCallSession } from './hooks/useCallSession';
import type { CallSignal } from './hooks/useCallSignaling';
import { styles } from './index.stylex';

interface CallParticipant {
   id: string;
   username: string;
   avatar_url: string | null;
}

interface CallPageProps {
   conversationId: string;
   authUserId: string;
   authUserName: string;
   authUserAvatar: string | null;
   callType: 'audio' | 'video';
   backHref: string;
   participants: CallParticipant[];
   displayName: string;
   displayAvatar: string | null;
   autoJoin?: boolean;
}

export default function CallPage({
   conversationId,
   authUserId,
   authUserName,
   authUserAvatar,
   callType,
   backHref,
   participants,
   displayName,
   displayAvatar,
   autoJoin = false,
}: CallPageProps) {
   const router = useRouter();
   const [phase, setPhase] = useState<'lobby' | 'call'>(autoJoin ? 'call' : 'lobby');
   const [callStartTime, setCallStartTime] = useState<number | null>(null);
   const localVideoRef = useRef<HTMLVideoElement>(null);
   const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

   const otherParticipantIds = participants.map(p => p.id);

   const session = useCallSession({
      conversationId,
      authUserId,
      callType,
      participantIds: otherParticipantIds,
      onEnded: () => {
         router.push(backHref);
      },
   });

   useEffect(() => {
      if (localVideoRef.current && session.localStream) {
         localVideoRef.current.srcObject = session.localStream;
      }
   }, [session.localStream]);

   useEffect(() => {
      for (const participant of session.remoteParticipants) {
         const el = remoteVideoRefs.current.get(participant.userId);
         if (el && participant.stream) {
            el.srcObject = participant.stream;
         }
      }
   }, [session.remoteParticipants]);

   const startMediaRef = useRef(session.startLocalMedia);
   const joinCallRef = useRef(session.joinCall);
   startMediaRef.current = session.startLocalMedia;
   joinCallRef.current = session.joinCall;

   useEffect(() => {
      if (!autoJoin) return;
      let cancelled = false;
      startMediaRef
         .current()
         .then(() => (cancelled ? undefined : joinCallRef.current()))
         .then(() => {
            if (!cancelled) setCallStartTime(Date.now());
         })
         .catch(() => {
            if (!cancelled) router.push(backHref);
         });
      return () => {
         cancelled = true;
      };
   }, [autoJoin, backHref, router]);

   async function handleStartCall() {
      await session.startLocalMedia();
      await sendCallEvent(conversationId, callType === 'video' ? 'video_started' : 'audio_started');

      const inviteSignal: CallSignal = {
         type: 'invite',
         fromUserId: authUserId,
         conversationId,
         callType,
         callerName: authUserName,
         callerAvatar: authUserAvatar,
      };

      for (const p of participants) {
         const ch = supabase.channel(`user-call:${p.id}`);
         await ch.subscribe();
         await ch.send({ type: 'broadcast', event: 'signal', payload: inviteSignal });
         supabase.removeChannel(ch);
      }

      await session.joinCall();
      setCallStartTime(Date.now());
      setPhase('call');
   }

   async function handleHangUp() {
      if (callStartTime) {
         await sendCallEvent(conversationId, callType === 'video' ? 'video_ended' : 'audio_ended');
      }
      await session.leaveCall();
      router.push(backHref);
   }

   return (
      <div {...stylex.props(styles.root)}>
         {phase === 'lobby' ? (
            <>
               <div {...stylex.props(styles.lobbyLayout)}>
                  <div {...stylex.props(styles.lobbyPreview)}>
                     {callType === 'video' ? (
                        <video
                           ref={localVideoRef}
                           autoPlay
                           muted
                           playsInline
                           {...stylex.props(styles.lobbyPreviewVideo)}
                        />
                     ) : (
                        <div {...stylex.props(styles.cameraOffPlaceholder)}>
                           <HiOutlineVideoCameraSlash {...stylex.props(styles.cameraOffIcon)} />
                           <span {...stylex.props(styles.cameraOffText)}>Camera off</span>
                        </div>
                     )}
                  </div>
                  <div {...stylex.props(styles.lobbyPanel)}>
                     <UserAvatar
                        src={displayAvatar}
                        alt={displayName}
                        size={80}
                        username={displayName}
                     />
                     <div {...stylex.props(styles.lobbyPanelTitle)}>{displayName}</div>
                     <div {...stylex.props(styles.lobbyPanelSubtitle)}>Ready to call?</div>
                     <button {...stylex.props(styles.startButton)} onClick={handleStartCall}>
                        Start call
                     </button>
                  </div>
               </div>
               <div {...stylex.props(styles.controlBar)}>
                  <button
                     {...stylex.props(
                        styles.controlBtn,
                        !session.isCameraOff && styles.controlBtnActive,
                     )}
                     onClick={session.toggleCamera}
                     aria-label="Toggle camera"
                  >
                     {session.isCameraOff ? (
                        <HiOutlineVideoCameraSlash />
                     ) : (
                        <HiOutlineVideoCamera />
                     )}
                  </button>
                  <button
                     {...stylex.props(
                        styles.controlBtn,
                        !session.isMuted && styles.controlBtnActive,
                     )}
                     onClick={session.toggleMute}
                     aria-label="Toggle mute"
                  >
                     {session.isMuted ? <IoMicOffOutline /> : <IoMicOutline />}
                  </button>
                  <button
                     {...stylex.props(
                        styles.controlBtn,
                        !session.isSpeakerOff && styles.controlBtnActive,
                     )}
                     onClick={session.toggleSpeaker}
                     aria-label="Toggle speaker"
                  >
                     {session.isSpeakerOff ? <IoVolumeMuteOutline /> : <IoVolumeHighOutline />}
                  </button>
                  <button
                     {...stylex.props(styles.controlBtn, styles.hangUpBtn)}
                     onClick={() => router.push(backHref)}
                     aria-label="Cancel"
                  >
                     <MdCallEnd />
                  </button>
               </div>
            </>
         ) : (
            <>
               <div {...stylex.props(styles.inCallLayout)}>
                  {session.remoteParticipants.length === 0 ? (
                     <span {...stylex.props(styles.waitingText)}>Waiting for others to join…</span>
                  ) : (
                     session.remoteParticipants.map(p => (
                        <div key={p.userId} {...stylex.props(styles.remoteVideoSlot)}>
                           {p.stream ? (
                              <video
                                 ref={el => {
                                    if (el) remoteVideoRefs.current.set(p.userId, el);
                                 }}
                                 autoPlay
                                 playsInline
                                 {...stylex.props(styles.remoteVideo)}
                              />
                           ) : (
                              <div {...stylex.props(styles.remoteAudioOnly)}>
                                 <IoCallOutline size={40} />
                              </div>
                           )}
                        </div>
                     ))
                  )}
                  {callType === 'video' && (
                     <div {...stylex.props(styles.localPip)}>
                        <video
                           ref={localVideoRef}
                           autoPlay
                           muted
                           playsInline
                           {...stylex.props(styles.localPipVideo)}
                        />
                     </div>
                  )}
               </div>
               <div {...stylex.props(styles.controlBar)}>
                  {callType === 'video' && (
                     <button
                        {...stylex.props(
                           styles.controlBtn,
                           !session.isCameraOff && styles.controlBtnActive,
                        )}
                        onClick={session.toggleCamera}
                        aria-label="Toggle camera"
                     >
                        {session.isCameraOff ? (
                           <HiOutlineVideoCameraSlash />
                        ) : (
                           <HiOutlineVideoCamera />
                        )}
                     </button>
                  )}
                  <button
                     {...stylex.props(
                        styles.controlBtn,
                        !session.isMuted && styles.controlBtnActive,
                     )}
                     onClick={session.toggleMute}
                     aria-label="Toggle mute"
                  >
                     {session.isMuted ? <IoMicOffOutline /> : <IoMicOutline />}
                  </button>
                  <button
                     {...stylex.props(styles.controlBtn, styles.hangUpBtn)}
                     onClick={handleHangUp}
                     aria-label="Hang up"
                  >
                     <MdCallEnd />
                  </button>
               </div>
            </>
         )}
      </div>
   );
}
