import { CURRENT_USER, SUGGESTED_USERS } from '@/src/mocks/users';
import type { PartialUser } from '@/src/types/global';

export interface Message {
   id: string;
   senderId: string;
   text: string;
   timestamp: string;
   seen: boolean;
}

export type MessageThreadFolder = 'primary' | 'general' | 'requests';

export interface MessageThread {
   id: string;
   folder: MessageThreadFolder;
   participants: PartialUser[];
   messages: Message[];
   lastMessageAt: string;
}

function h(date: Date): string {
   return date.toISOString();
}

const now = new Date();
const day = 86_400_000;

export const REQUEST_USER: PartialUser = {
   id: 'r1',
   username: 'd1anth00s._',
   full_name: 'Dianthos',
   avatar_url:
      'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/dianthos.jpg',
};

export const MESSAGE_THREADS: MessageThread[] = [
   {
      id: 't1',
      folder: 'primary',
      participants: [SUGGESTED_USERS[0]],
      messages: [
         {
            id: 't1-1',
            senderId: SUGGESTED_USERS[0].id,
            text: 'Hey! Just saw your latest post — the one at the coast. Honestly one of the best things you have shot this year.',
            timestamp: h(new Date(now.getTime() - day * 14)),
            seen: true,
         },
         {
            id: 't1-2',
            senderId: SUGGESTED_USERS[0].id,
            text: 'The way you caught the light on the water is incredible. What time of day was that?',
            timestamp: h(new Date(now.getTime() - day * 14 + 2 * 60_000)),
            seen: true,
         },
         {
            id: 't1-3',
            senderId: CURRENT_USER.id,
            text: 'Thank you so much! That means a lot coming from you.',
            timestamp: h(new Date(now.getTime() - day * 14 + 3600_000)),
            seen: true,
         },
         {
            id: 't1-4',
            senderId: CURRENT_USER.id,
            text: 'It was golden hour, maybe 40 minutes before sunset. I had been waiting there for almost two hours for the clouds to clear up.',
            timestamp: h(new Date(now.getTime() - day * 14 + 3600_000 + 90_000)),
            seen: true,
         },
         {
            id: 't1-5',
            senderId: CURRENT_USER.id,
            text: 'Totally worth the wait though. The diffusion filter I had on really softened the highlights.',
            timestamp: h(new Date(now.getTime() - day * 14 + 3600_000 + 150_000)),
            seen: true,
         },
         {
            id: 't1-6',
            senderId: SUGGESTED_USERS[0].id,
            text: 'That patience really shows. Which camera were you shooting with?',
            timestamp: h(new Date(now.getTime() - day * 14 + 7200_000)),
            seen: true,
         },
         {
            id: 't1-7',
            senderId: CURRENT_USER.id,
            text: 'Fuji X100V. I know everyone says it but it genuinely changed how I approach photography.',
            timestamp: h(new Date(now.getTime() - day * 14 + 10800_000)),
            seen: true,
         },
         {
            id: 't1-8',
            senderId: SUGGESTED_USERS[0].id,
            text: 'I have been going back and forth on it for months.',
            timestamp: h(new Date(now.getTime() - day * 10)),
            seen: true,
         },
         {
            id: 't1-9',
            senderId: SUGGESTED_USERS[0].id,
            text: 'The fixed lens thing scared me off at first but looking at your work I think I am ready to commit.',
            timestamp: h(new Date(now.getTime() - day * 10 + 90_000)),
            seen: true,
         },
         {
            id: 't1-10',
            senderId: SUGGESTED_USERS[0].id,
            text: 'Could I borrow yours for a weekend to test it before I buy?',
            timestamp: h(new Date(now.getTime() - day * 10 + 180_000)),
            seen: true,
         },
         {
            id: 't1-11',
            senderId: CURRENT_USER.id,
            text: 'Of course! I am actually free this Saturday if you want to meet up.',
            timestamp: h(new Date(now.getTime() - day * 10 + 3600_000)),
            seen: true,
         },
         {
            id: 't1-12',
            senderId: CURRENT_USER.id,
            text: 'We could even go shoot together somewhere so you get a proper feel for it in the field.',
            timestamp: h(new Date(now.getTime() - day * 10 + 3600_000 + 60_000)),
            seen: true,
         },
         {
            id: 't1-13',
            senderId: SUGGESTED_USERS[0].id,
            text: 'That sounds perfect. Saturday afternoon works great.',
            timestamp: h(new Date(now.getTime() - day * 7)),
            seen: true,
         },
         {
            id: 't1-14',
            senderId: SUGGESTED_USERS[0].id,
            text: 'Are you still coming? I just want to make sure before I head out.',
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: true,
         },
         {
            id: 't1-15',
            senderId: CURRENT_USER.id,
            text: 'Yes! Would not miss it.',
            timestamp: h(new Date(now.getTime() - day * 2 + 3600_000)),
            seen: true,
         },
         {
            id: 't1-16',
            senderId: CURRENT_USER.id,
            text: 'I will text you the address in the morning. See you around 2!',
            timestamp: h(new Date(now.getTime() - day * 2 + 3600_000 + 60_000)),
            seen: true,
         },
         {
            id: 't1-17',
            senderId: SUGGESTED_USERS[0].id,
            text: 'Perfect. I will bring coffee ☕',
            timestamp: h(new Date(now.getTime() - 3600_000 * 5)),
            seen: false,
         },
         {
            id: 't1-18',
            senderId: CURRENT_USER.id,
            text: 'You are the best, see you soon!',
            timestamp: h(new Date(now.getTime() - 3600_000 * 3)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - 3600_000 * 3)),
   },
   {
      id: 't2',
      folder: 'general',
      participants: [SUGGESTED_USERS[1]],
      messages: [
         {
            id: 't2-1',
            senderId: SUGGESTED_USERS[1].id,
            text: 'Hey are you coming to the gallery opening on Friday? It is going to be a good one.',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 't2-2',
            senderId: SUGGESTED_USERS[1].id,
            text: 'Mara and Jonas are both showing new work and there is a live set from that DJ we saw last summer.',
            timestamp: h(new Date(now.getTime() - day * 3 + 60_000)),
            seen: true,
         },
         {
            id: 't2-3',
            senderId: CURRENT_USER.id,
            text: "Wouldn't miss it! What time does it start?",
            timestamp: h(new Date(now.getTime() - day * 3 + 3600_000)),
            seen: true,
         },
         {
            id: 't2-4',
            senderId: SUGGESTED_USERS[1].id,
            text: '7 PM doors, but come around 7:30 when the crowd thins a bit.',
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: true,
         },
         {
            id: 't2-5',
            senderId: SUGGESTED_USERS[1].id,
            text: "I'll save you a spot by the bar 😄",
            timestamp: h(new Date(now.getTime() - day * 2 + 30_000)),
            seen: false,
         },
         {
            id: 't2-6',
            senderId: CURRENT_USER.id,
            text: 'Perfect, see you there!',
            timestamp: h(new Date(now.getTime() - day * 1)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 1)),
   },
   {
      id: 't3',
      folder: 'requests',
      participants: [SUGGESTED_USERS[2]],
      messages: [
         {
            id: 't3-1',
            senderId: SUGGESTED_USERS[2].id,
            text: 'Been working on a new color palette for the next series and I think I finally nailed it.',
            timestamp: h(new Date(now.getTime() - day * 5)),
            seen: true,
         },
         {
            id: 't3-2',
            senderId: SUGGESTED_USERS[2].id,
            text: 'Lots of muted earth tones, almost like dried clay and sage. Very different from the last collection.',
            timestamp: h(new Date(now.getTime() - day * 5 + 60_000)),
            seen: true,
         },
         {
            id: 't3-3',
            senderId: SUGGESTED_USERS[2].id,
            text: 'I will post a preview tomorrow but wanted you to see it first.',
            timestamp: h(new Date(now.getTime() - day * 5 + 120_000)),
            seen: true,
         },
         {
            id: 't3-6',
            senderId: SUGGESTED_USERS[2].id,
            text: 'Mostly photo but I want to layer some textile pieces in front of the lens.',
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
         {
            id: 't3-7',
            senderId: SUGGESTED_USERS[2].id,
            text: 'Kind of like shooting through fabric to get this dreamy diffused look.',
            timestamp: h(new Date(now.getTime() - day * 4 + 45_000)),
            seen: true,
         },
         {
            id: 't3-9',
            senderId: SUGGESTED_USERS[2].id,
            text: 'Haha deal, I will hold you to that!',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 3)),
   },
   {
      id: 't4',
      folder: 'primary',
      participants: [SUGGESTED_USERS[3]],
      messages: [
         {
            id: 't4-1',
            senderId: CURRENT_USER.id,
            text: 'That track you sent me last week has been on repeat ever since. I think it broke my algorithm.',
            timestamp: h(new Date(now.getTime() - day * 7)),
            seen: true,
         },
         {
            id: 't4-2',
            senderId: CURRENT_USER.id,
            text: 'Spotify keeps recommending me stuff that sounds nothing like it lol',
            timestamp: h(new Date(now.getTime() - day * 7 + 30_000)),
            seen: true,
         },
         {
            id: 't4-3',
            senderId: SUGGESTED_USERS[3].id,
            text: 'Haha I knew you would get obsessed with it.',
            timestamp: h(new Date(now.getTime() - day * 7 + 3600_000)),
            seen: true,
         },
         {
            id: 't4-4',
            senderId: SUGGESTED_USERS[3].id,
            text: 'The bass drop at 2:30 is the reason I could not sleep for three days after I first heard it.',
            timestamp: h(new Date(now.getTime() - day * 7 + 3600_000 + 45_000)),
            seen: true,
         },
         {
            id: 't4-5',
            senderId: SUGGESTED_USERS[3].id,
            text: 'That producer has a whole catalog like that. Very raw, very underground.',
            timestamp: h(new Date(now.getTime() - day * 7 + 3600_000 + 90_000)),
            seen: true,
         },
         {
            id: 't4-6',
            senderId: CURRENT_USER.id,
            text: 'Please send me more. I need it.',
            timestamp: h(new Date(now.getTime() - day * 7 + 7200_000)),
            seen: true,
         },
         {
            id: 't4-7',
            senderId: SUGGESTED_USERS[3].id,
            text: 'I have a whole playlist curated for exactly this feeling. Will drop it here.',
            timestamp: h(new Date(now.getTime() - day * 6)),
            seen: false,
         },
         {
            id: 't4-8',
            senderId: SUGGESTED_USERS[3].id,
            text: 'Fair warning: you might not leave your apartment for the weekend 😅',
            timestamp: h(new Date(now.getTime() - day * 6 + 30_000)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 6)),
   },
   {
      id: 't5',
      folder: 'primary',
      participants: [SUGGESTED_USERS[4]],
      messages: [
         {
            id: 't5-1',
            senderId: SUGGESTED_USERS[4].id,
            text: 'Yesterday was such a great session. The light in that warehouse space was unreal.',
            timestamp: h(new Date(now.getTime() - day * 10)),
            seen: true,
         },
         {
            id: 't5-2',
            senderId: SUGGESTED_USERS[4].id,
            text: 'I already edited a few and honestly this might be my favorite set we have done together.',
            timestamp: h(new Date(now.getTime() - day * 10 + 60_000)),
            seen: true,
         },
         {
            id: 't5-3',
            senderId: CURRENT_USER.id,
            text: 'Completely agree. I was in the zone from the first shot.',
            timestamp: h(new Date(now.getTime() - day * 10 + 3600_000)),
            seen: true,
         },
         {
            id: 't5-4',
            senderId: CURRENT_USER.id,
            text: "I'll bring the 85mm next time. I think it would work even better in a space like that.",
            timestamp: h(new Date(now.getTime() - day * 10 + 3600_000 + 60_000)),
            seen: true,
         },
         {
            id: 't5-5',
            senderId: CURRENT_USER.id,
            text: 'Also want to try with no reflectors and just work with the available shadows.',
            timestamp: h(new Date(now.getTime() - day * 10 + 3600_000 + 120_000)),
            seen: true,
         },
         {
            id: 't5-6',
            senderId: SUGGESTED_USERS[4].id,
            text: 'Yes! More contrast, less polish. That is the vibe I want.',
            timestamp: h(new Date(now.getTime() - day * 9)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 9)),
   },
   {
      id: 't6',
      folder: 'primary',
      participants: [SUGGESTED_USERS[5]],
      messages: [
         {
            id: 't6-1',
            senderId: SUGGESTED_USERS[5].id,
            text: 'Hey do you still have the notes from the design meetup last week?',
            timestamp: h(new Date(now.getTime() - day * 14)),
            seen: true,
         },
         {
            id: 't6-2',
            senderId: SUGGESTED_USERS[5].id,
            text: 'I lost mine and I need the part about the new component structure we discussed.',
            timestamp: h(new Date(now.getTime() - day * 14 + 30_000)),
            seen: true,
         },
         {
            id: 't6-3',
            senderId: CURRENT_USER.id,
            text: 'Yeah I have them! Give me a moment to find the doc.',
            timestamp: h(new Date(now.getTime() - day * 14 + 3600_000)),
            seen: true,
         },
         {
            id: 't6-4',
            senderId: CURRENT_USER.id,
            text: 'Found it. The component structure section starts on page 4. I will paste the key points here.',
            timestamp: h(new Date(now.getTime() - day * 14 + 3600_000 + 120_000)),
            seen: true,
         },
         {
            id: 't6-5',
            senderId: CURRENT_USER.id,
            text: 'Basically we agreed on atomic structure with a shared token layer, no hardcoded values anywhere in component files.',
            timestamp: h(new Date(now.getTime() - day * 14 + 3600_000 + 180_000)),
            seen: true,
         },
         {
            id: 't6-6',
            senderId: SUGGESTED_USERS[5].id,
            text: 'That is exactly what I needed, thank you so much!',
            timestamp: h(new Date(now.getTime() - day * 13)),
            seen: true,
         },
         {
            id: 't6-7',
            senderId: SUGGESTED_USERS[5].id,
            text: 'Also can you send me the full doc? I want to share it with the rest of the team.',
            timestamp: h(new Date(now.getTime() - day * 13 + 30_000)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 13)),
   },
   {
      id: 't7',
      folder: 'general',
      participants: [SUGGESTED_USERS[6]],
      messages: [
         {
            id: 't7-1',
            senderId: SUGGESTED_USERS[6].id,
            text: 'Happy birthday!! 🎂🎉 Hope you are having the best day.',
            timestamp: h(new Date(now.getTime() - day * 30)),
            seen: true,
         },
         {
            id: 't7-2',
            senderId: SUGGESTED_USERS[6].id,
            text: 'We should do something to celebrate properly this weekend if you are around.',
            timestamp: h(new Date(now.getTime() - day * 30 + 60_000)),
            seen: true,
         },
         {
            id: 't7-3',
            senderId: CURRENT_USER.id,
            text: 'Thank you Echo! Genuinely made my morning seeing this 🙌',
            timestamp: h(new Date(now.getTime() - day * 30 + 3600_000)),
            seen: true,
         },
         {
            id: 't7-4',
            senderId: CURRENT_USER.id,
            text: 'Weekend sounds perfect, let us plan something.',
            timestamp: h(new Date(now.getTime() - day * 30 + 3600_000 + 60_000)),
            seen: true,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 30)),
   },
   {
      id: 't8',
      folder: 'general',
      participants: [SUGGESTED_USERS[7]],
      messages: [
         {
            id: 't8-1',
            senderId: SUGGESTED_USERS[7].id,
            text: 'The exhibit layout is finally ready for review! Took longer than expected but I am really happy with how it came together.',
            timestamp: h(new Date(now.getTime() - day * 4)),
            seen: true,
         },
         {
            id: 't8-2',
            senderId: SUGGESTED_USERS[7].id,
            text: 'I repositioned the main installation to the back wall and it changes the whole flow of the space.',
            timestamp: h(new Date(now.getTime() - day * 4 + 45_000)),
            seen: true,
         },
         {
            id: 't8-3',
            senderId: CURRENT_USER.id,
            text: 'On it! I will take a look this afternoon and leave comments in the doc.',
            timestamp: h(new Date(now.getTime() - day * 4 + 3600_000)),
            seen: true,
         },
         {
            id: 't8-4',
            senderId: SUGGESTED_USERS[7].id,
            text: 'No rush at all, just wanted to let you know it is up.',
            timestamp: h(new Date(now.getTime() - day * 4 + 3600_000 + 60_000)),
            seen: true,
         },
         {
            id: 't8-5',
            senderId: CURRENT_USER.id,
            text: 'Just reviewed it — moving the installation to the back is a great call. Much better sightlines from the entrance.',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 't8-6',
            senderId: CURRENT_USER.id,
            text: 'Only note is the lighting diagram on slide 7 might need updating to match the new position.',
            timestamp: h(new Date(now.getTime() - day * 3 + 60_000)),
            seen: true,
         },
         {
            id: 't8-7',
            senderId: SUGGESTED_USERS[7].id,
            text: 'Good catch, will fix that today. Thanks for the thorough review!',
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 2)),
   },
   {
      id: 't9',
      folder: 'general',
      participants: [SUGGESTED_USERS[8]],
      messages: [
         {
            id: 't9-1',
            senderId: SUGGESTED_USERS[8].id,
            text: 'Are we still on for the hike this weekend? I have been checking the forecast obsessively.',
            timestamp: h(new Date(now.getTime() - day * 8)),
            seen: true,
         },
         {
            id: 't9-2',
            senderId: SUGGESTED_USERS[8].id,
            text: 'Saturday looks clear but Sunday might get cloudy in the afternoon.',
            timestamp: h(new Date(now.getTime() - day * 8 + 30_000)),
            seen: true,
         },
         {
            id: 't9-3',
            senderId: CURRENT_USER.id,
            text: "Let's do Saturday then. Early start? I was thinking 7 AM at the trailhead.",
            timestamp: h(new Date(now.getTime() - day * 8 + 3600_000)),
            seen: true,
         },
         {
            id: 't9-4',
            senderId: SUGGESTED_USERS[8].id,
            text: '7 AM works perfectly. I will bring extra water and snacks for both of us.',
            timestamp: h(new Date(now.getTime() - day * 8 + 7200_000)),
            seen: true,
         },
         {
            id: 't9-5',
            senderId: SUGGESTED_USERS[8].id,
            text: 'Also thinking we do the longer loop this time since we will have all morning 💪',
            timestamp: h(new Date(now.getTime() - day * 8 + 7200_000 + 30_000)),
            seen: true,
         },
         {
            id: 't9-6',
            senderId: CURRENT_USER.id,
            text: "Let's do it. I need the distance after this week.",
            timestamp: h(new Date(now.getTime() - day * 7)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 7)),
   },
   {
      id: 't10',
      folder: 'primary',
      participants: [SUGGESTED_USERS[9]],
      messages: [
         {
            id: 't10-1',
            senderId: SUGGESTED_USERS[9].id,
            text: 'Coffee this Sunday? I found this tiny place that opened last month, no Instagram presence at all, just word of mouth.',
            timestamp: h(new Date(now.getTime() - day * 3)),
            seen: true,
         },
         {
            id: 't10-2',
            senderId: SUGGESTED_USERS[9].id,
            text: 'Supposedly their single origin pour over is exceptional. I have been meaning to check it out.',
            timestamp: h(new Date(now.getTime() - day * 3 + 45_000)),
            seen: true,
         },
         {
            id: 't10-3',
            senderId: CURRENT_USER.id,
            text: 'That sounds exactly like the kind of place I need right now.',
            timestamp: h(new Date(now.getTime() - day * 3 + 3600_000)),
            seen: true,
         },
         {
            id: 't10-4',
            senderId: CURRENT_USER.id,
            text: "Sunday works great. Let's say 3 PM?",
            timestamp: h(new Date(now.getTime() - day * 3 + 3600_000 + 30_000)),
            seen: true,
         },
         {
            id: 't10-5',
            senderId: SUGGESTED_USERS[9].id,
            text: 'Perfect. I will send you the address, it is a bit tucked away.',
            timestamp: h(new Date(now.getTime() - day * 2)),
            seen: false,
         },
      ],
      lastMessageAt: h(new Date(now.getTime() - day * 2)),
   },
];

export function getRequestThreads(): MessageThread[] {
   return MESSAGE_THREADS.filter(t => t.folder === 'requests');
}
