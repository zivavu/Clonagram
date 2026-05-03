import type { PartialUser } from '@/src/types/global';
import { CURRENT_USER, SUGGESTED_USERS } from '../Home/data';

export interface Message {
   id: string;
   senderId: string;
   text: string;
   timestamp: string; // ISO 8601
   seen: boolean;
}

export interface MessageThread {
   id: string;
   participants: PartialUser[];
   messages: Message[];
   lastMessageAt: string;
}

function h(date: Date): string {
   return date.toISOString();
}

const now = new Date();
const day = 86_400_000;

export const MESSAGE_THREADS: MessageThread[] = [
   {
      id: 't1',
      participants: [SUGGESTED_USERS[0]],
      messages: [
         {
            id: 'm1',
            senderId: CURRENT_USER.id,
            text: 'Hey! Love your latest post 🌊',
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: true,
         },
         {
            id: 'm2',
            senderId: SUGGESTED_USERS[0].id,
            text: 'Thank you so much! I shot it at the coast last weekend.',
            timestamp: h(new Date(now.getTime() - day * 2 + 3600_000)),
            seen: true,
         },
         {
            id: 'm3',
            senderId: CURRENT_USER.id,
            text: 'The lighting is incredible. What camera did you use?',
            timestamp: h(new Date(now.getTime() - day * 1)),
            seen: true,
         },
         {
            id: 'm4',
            senderId: SUGGESTED_USERS[0].id,
            text: 'Just my Fuji X100V with a diffusion filter!',
            timestamp: h(new Date(now.getTime() - day * 1 + 1800_000)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 1 + 1800_000)),
   },
   {
      id: 't2',
      participants: [SUGGESTED_USERS[1]],
      messages: [
         {
            id: 'm5',
            senderId: SUGGESTED_USERS[1].id,
            text: 'Are you coming to the gallery opening on Friday?',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 'm6',
            senderId: CURRENT_USER.id,
            text: "Wouldn't miss it! What time does it start?",
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 'm7',
            senderId: SUGGESTED_USERS[1].id,
            text: "7 PM. I'll save you a spot by the bar 😄",
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 2)),
   },
   {
      id: 't3',
      participants: [SUGGESTED_USERS[2]],
      messages: [
         {
            id: 'm8',
            senderId: SUGGESTED_USERS[2].id,
            text: "Check out this new palette I've been working on!",
            timestamp: h(new Date(now.getTime() - day * 5)),
            seen: true,
         },
         {
            id: 'm9',
            senderId: CURRENT_USER.id,
            text: "That's gorgeous! The earth tones are perfect.",
            timestamp: h(new Date(now.getTime() - day * 5)),
            seen: true,
         },
         {
            id: 'm10',
            senderId: SUGGESTED_USERS[2].id,
            text: "Thanks! I'm thinking of doing a series with these.",
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
         {
            id: 'm11',
            senderId: CURRENT_USER.id,
            text: 'You definitely should. Let me know if you need a model 😄',
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
         {
            id: 'm12',
            senderId: SUGGESTED_USERS[2].id,
            text: 'Haha, deal!',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 3)),
   },
   {
      id: 't4',
      participants: [SUGGESTED_USERS[3]],
      messages: [
         {
            id: 'm13',
            senderId: CURRENT_USER.id,
            text: 'That track you recommended is on repeat 🔥',
            timestamp: h(new Date(now.getTime() - day * 7)),
            seen: true,
         },
         {
            id: 'm14',
            senderId: SUGGESTED_USERS[3].id,
            text: 'Right?! The bass drop at 2:30 is insane.',
            timestamp: h(new Date(now.getTime() - day * 7)),
            seen: true,
         },
         {
            id: 'm15',
            senderId: SUGGESTED_USERS[3].id,
            text: 'I have a whole playlist if you want it',
            timestamp: h(new Date(now.getTime() - day * 6)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 6)),
   },
   {
      id: 't5',
      participants: [SUGGESTED_USERS[4]],
      messages: [
         {
            id: 'm16',
            senderId: SUGGESTED_USERS[4].id,
            text: 'Great session yesterday! We should shoot again soon.',
            timestamp: h(new Date(now.getTime() - day * 10)),
            seen: true,
         },
         {
            id: 'm17',
            senderId: CURRENT_USER.id,
            text: "Absolutely! I'll bring the other lens next time.",
            timestamp: h(new Date(now.getTime() - day * 10)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 10)),
   },
   {
      id: 't6',
      participants: [SUGGESTED_USERS[5]],
      messages: [
         {
            id: 'm18',
            senderId: SUGGESTED_USERS[5].id,
            text: 'Do you have the notes from the design meetup?',
            timestamp: h(new Date(now.getTime() - day * 14)),
            seen: true,
         },
         {
            id: 'm19',
            senderId: CURRENT_USER.id,
            text: "Yeah! I'll send them over in a bit.",
            timestamp: h(new Date(now.getTime() - day * 14)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 14)),
   },
   {
      id: 't7',
      participants: [SUGGESTED_USERS[6]],
      messages: [
         {
            id: 'm20',
            senderId: SUGGESTED_USERS[6].id,
            text: 'Happy birthday man! 🎂🎉',
            timestamp: h(new Date(now.getTime() - day * 30)),
            seen: true,
         },
         {
            id: 'm21',
            senderId: CURRENT_USER.id,
            text: 'Thanks Echo! Means a lot 🙌',
            timestamp: h(new Date(now.getTime() - day * 30)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 30)),
   },
   {
      id: 't8',
      participants: [SUGGESTED_USERS[7]], // fragment.studio
      messages: [
         {
            id: 'm22',
            senderId: SUGGESTED_USERS[7].id,
            text: 'The exhibit layout is ready for review!',
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
         {
            id: 'm23',
            senderId: CURRENT_USER.id,
            text: "On it! I'll take a look this afternoon.",
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
         {
            id: 'm24',
            senderId: SUGGESTED_USERS[7].id,
            text: "No rush, just wanted to let you know it's up.",
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 4)),
   },
   {
      id: 't9',
      participants: [SUGGESTED_USERS[8]], // gravel.path
      messages: [
         {
            id: 'm25',
            senderId: SUGGESTED_USERS[8].id,
            text: 'Are we still on for the hike this weekend?',
            timestamp: h(new Date(now.getTime() - day * 8)),
            seen: true,
         },
         {
            id: 'm26',
            senderId: CURRENT_USER.id,
            text: '100%! Weather looks perfect for it.',
            timestamp: h(new Date(now.getTime() - day * 8)),
            seen: true,
         },
         {
            id: 'm27',
            senderId: SUGGESTED_USERS[8].id,
            text: "Awesome. I'll bring extra water 💪",
            timestamp: h(new Date(now.getTime() - day * 8)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 8)),
   },
   {
      id: 't10',
      participants: [SUGGESTED_USERS[9], SUGGESTED_USERS[10]],
      messages: [
         {
            id: 'm28',
            senderId: SUGGESTED_USERS[9].id,
            text: 'Coffee this Sunday? ☕',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 'm29',
            senderId: SUGGESTED_USERS[10].id,
            text: "I'm free in the afternoon!",
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 'm30',
            senderId: CURRENT_USER.id,
            text: "Same here. Let's do 3 PM at that new place downtown.",
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 2)),
   },
];

export function formatTimestamp(isoString: string): string {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   const days = Math.floor(diff / day);

   if (days === 0) {
      const diffMinutes = Math.floor(diff / 60_000);
      if (diffMinutes < 1) return 'now';
      if (diffMinutes < 60) return `${diffMinutes}m`;
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h`;
   }
   if (days === 1) return 'Yesterday';
   if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getThreadDisplayName(thread: MessageThread): string {
   if (thread.participants.length === 1) {
      return thread.participants[0].name || thread.participants[0].username;
   }
   return thread.participants.map(p => p.name || p.username).join(', ');
}

export function getLastMessagePreview(thread: MessageThread): string {
   const lastMsg = thread.messages[thread.messages.length - 1];
   const isFromMe = lastMsg.senderId === CURRENT_USER.id;
   const prefix = isFromMe ? 'You: ' : '';
   const text = lastMsg.text.length > 50 ? `${lastMsg.text.slice(0, 50)}...` : lastMsg.text;
   return prefix + text;
}

export function hasUnreadMessages(thread: MessageThread): boolean {
   return thread.messages.some(m => m.senderId !== CURRENT_USER.id && !m.seen);
}
