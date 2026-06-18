const STUN_SERVERS: RTCIceServer[] = [
   { urls: 'stun:stun.l.google.com:19302' },
   { urls: 'stun:stun1.l.google.com:19302' },
];

export function getIceServers() {
   const turnUrls = process.env.NEXT_PUBLIC_TURN_URLS;
   const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
   const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

   if (!turnUrls || !turnUsername || !turnCredential) {
      return STUN_SERVERS;
   }

   const urls = turnUrls
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);

   return [...STUN_SERVERS, { urls, username: turnUsername, credential: turnCredential }];
}
