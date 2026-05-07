import type { PartialUser } from '@/src/types/global';

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'story_like';

export type NotificationTargetType = 'post' | 'reel' | 'story' | 'comment';

export type NotificationTarget = {
   id: string;
   type: NotificationTargetType;
   thumbnailUrl?: string;
};

export type Notification = {
   id: string;
   type: NotificationType;
   actors: PartialUser[];
   target?: NotificationTarget;
   message?: string;
   createdAt: string;
   isRead: boolean;
};

export const VERIFIED_USERS = new Set(['crumbling.concrete', 'palette.stains']);

export const NOTIFICATIONS: Notification[] = [
   // Today
   {
      id: 'n1',
      type: 'like',
      actors: [
         {
            id: 's1',
            username: 'lunar.drift',
            name: 'Luna Marchetti',
            avatarUrl: 'https://picsum.photos/seed/luna/200/200',
         },
         {
            id: 's2',
            username: 'static.signal',
            name: 'Elias Voss',
            avatarUrl: 'https://picsum.photos/seed/elias/200/200',
         },
      ],
      target: {
         id: '1',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona1/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
   },
   {
      id: 'n2',
      type: 'like',
      actors: [
         {
            id: 's3',
            username: 'palette.stains',
            name: 'Maya Okonkwo',
            avatarUrl: 'https://picsum.photos/seed/maya/200/200',
         },
         {
            id: 's4',
            username: 'nocturne.moth',
            name: 'Clara Bisset',
            avatarUrl: 'https://picsum.photos/seed/clara/200/200',
         },
      ],
      target: {
         id: '2',
         type: 'reel',
         thumbnailUrl: 'https://picsum.photos/seed/clona2/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: false,
   },
   {
      id: 'n3',
      type: 'comment',
      actors: [
         {
            id: 's5',
            username: 'crumbling.concrete',
            name: 'Dariel Kim',
            avatarUrl: 'https://picsum.photos/seed/dariel/200/200',
         },
      ],
      target: {
         id: '1',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona1/200/200',
      },
      message: 'This is absolutely incredible! Where was this taken?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      isRead: false,
   },
   {
      id: 'n4',
      type: 'follow',
      actors: [
         {
            id: 's6',
            username: 'cyan.rabbit',
            name: 'Sofia Lindgren',
            avatarUrl: 'https://picsum.photos/seed/sofia/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      isRead: true,
   },
   {
      id: 'n5',
      type: 'like',
      actors: [
         {
            id: 's7',
            username: 'echo.park',
            name: 'James Okoro',
            avatarUrl: 'https://picsum.photos/seed/james/200/200',
         },
         {
            id: 's8',
            username: 'fragment.studio',
            name: 'Aiko Tanaka',
            avatarUrl: 'https://picsum.photos/seed/aiko/200/200',
         },
         {
            id: 's9',
            username: 'gravel.path',
            name: 'Marcus Webb',
            avatarUrl: 'https://picsum.photos/seed/marcus/200/200',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona3/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isRead: true,
   },
   {
      id: 'n6',
      type: 'story_like',
      actors: [
         {
            id: 's10',
            username: 'hollow.shell',
            name: 'Priya Desai',
            avatarUrl: 'https://picsum.photos/seed/priya/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      isRead: true,
   },
   {
      id: 'n7',
      type: 'mention',
      actors: [
         {
            id: 's11',
            username: 'ivy.clad',
            name: 'Tommaso Bianchi',
            avatarUrl: 'https://picsum.photos/seed/tommaso/200/200',
         },
      ],
      target: {
         id: 'c1',
         type: 'comment',
      },
      message: 'Hey @zivavu you should check this out!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      isRead: true,
   },
   {
      id: 'n8',
      type: 'like',
      actors: [
         { id: 's12', username: 'jade.petal', name: 'Yuki Chen', avatarUrl: 'https://picsum.photos/seed/yuki/200/200' },
         {
            id: 's13',
            username: 'kettle.black',
            name: 'Fatima Al-Rashid',
            avatarUrl: 'https://picsum.photos/seed/fatima/200/200',
         },
      ],
      target: {
         id: '1',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona1/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      isRead: true,
   },
   {
      id: 'n9',
      type: 'follow',
      actors: [
         {
            id: 's14',
            username: 'loose.thread',
            name: 'Oliver Grant',
            avatarUrl: 'https://picsum.photos/seed/oliver/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      isRead: true,
   },

   // This month
   {
      id: 'n10',
      type: 'follow',
      actors: [
         {
            id: 's15',
            username: 'melted.wax',
            name: 'Isabela Rojas',
            avatarUrl: 'https://picsum.photos/seed/isabela/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      isRead: true,
   },
   {
      id: 'n11',
      type: 'tag',
      actors: [
         {
            id: 's16',
            username: 'nickel.fern',
            name: 'Arjun Mehta',
            avatarUrl: 'https://picsum.photos/seed/arjun/200/200',
         },
      ],
      target: {
         id: '4',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona4/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      isRead: true,
   },
   {
      id: 'n12',
      type: 'comment',
      actors: [
         { id: 's17', username: 'oxide.rust', name: 'Lea Müller', avatarUrl: 'https://picsum.photos/seed/lea/200/200' },
      ],
      target: {
         id: '2',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona2/200/200',
      },
      message: 'The colors in this shot are unreal 🔥',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      isRead: true,
   },
   {
      id: 'n13',
      type: 'like',
      actors: [
         {
            id: 's18',
            username: 'prism.break',
            name: 'Kwame Asante',
            avatarUrl: 'https://picsum.photos/seed/kwame/200/200',
         },
         {
            id: 's19',
            username: 'quartz.dust',
            name: 'Nora Farsi',
            avatarUrl: 'https://picsum.photos/seed/nora/200/200',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona3/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      isRead: true,
   },
   {
      id: 'n14',
      type: 'follow',
      actors: [
         {
            id: 's20',
            username: 'ripple.effect',
            name: 'Hugo Silva',
            avatarUrl: 'https://picsum.photos/seed/hugo/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      isRead: true,
   },
   {
      id: 'n15',
      type: 'mention',
      actors: [
         {
            id: 's1',
            username: 'lunar.drift',
            name: 'Luna Marchetti',
            avatarUrl: 'https://picsum.photos/seed/luna/200/200',
         },
      ],
      target: {
         id: 'c2',
         type: 'comment',
      },
      message: 'This reminds me of that trip we took @zivavu',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      isRead: true,
   },
   {
      id: 'n16',
      type: 'story_like',
      actors: [
         {
            id: 's2',
            username: 'static.signal',
            name: 'Elias Voss',
            avatarUrl: 'https://picsum.photos/seed/elias/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      isRead: true,
   },
   {
      id: 'n17',
      type: 'like',
      actors: [
         {
            id: 's3',
            username: 'palette.stains',
            name: 'Maya Okonkwo',
            avatarUrl: 'https://picsum.photos/seed/maya/200/200',
         },
      ],
      target: {
         id: '1',
         type: 'reel',
         thumbnailUrl: 'https://picsum.photos/seed/clona1/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      isRead: true,
   },
   {
      id: 'n18',
      type: 'follow',
      actors: [
         {
            id: 's4',
            username: 'nocturne.moth',
            name: 'Clara Bisset',
            avatarUrl: 'https://picsum.photos/seed/clara/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      isRead: true,
   },
   {
      id: 'n19',
      type: 'comment',
      actors: [
         {
            id: 's5',
            username: 'crumbling.concrete',
            name: 'Dariel Kim',
            avatarUrl: 'https://picsum.photos/seed/dariel/200/200',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona3/200/200',
      },
      message: ' Composition is perfect. What lens did you use?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      isRead: true,
   },
   {
      id: 'n20',
      type: 'follow',
      actors: [
         {
            id: 's6',
            username: 'cyan.rabbit',
            name: 'Sofia Lindgren',
            avatarUrl: 'https://picsum.photos/seed/sofia/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
      isRead: true,
   },
   {
      id: 'n21',
      type: 'like',
      actors: [
         {
            id: 's7',
            username: 'echo.park',
            name: 'James Okoro',
            avatarUrl: 'https://picsum.photos/seed/james/200/200',
         },
         {
            id: 's8',
            username: 'fragment.studio',
            name: 'Aiko Tanaka',
            avatarUrl: 'https://picsum.photos/seed/aiko/200/200',
         },
         {
            id: 's9',
            username: 'gravel.path',
            name: 'Marcus Webb',
            avatarUrl: 'https://picsum.photos/seed/marcus/200/200',
         },
         {
            id: 's10',
            username: 'hollow.shell',
            name: 'Priya Desai',
            avatarUrl: 'https://picsum.photos/seed/priya/200/200',
         },
      ],
      target: {
         id: '2',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona2/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
      isRead: true,
   },
   {
      id: 'n22',
      type: 'tag',
      actors: [
         {
            id: 's11',
            username: 'ivy.clad',
            name: 'Tommaso Bianchi',
            avatarUrl: 'https://picsum.photos/seed/tommaso/200/200',
         },
      ],
      target: {
         id: '5',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona5/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 27).toISOString(),
      isRead: true,
   },
   {
      id: 'n23',
      type: 'follow',
      actors: [
         { id: 's12', username: 'jade.petal', name: 'Yuki Chen', avatarUrl: 'https://picsum.photos/seed/yuki/200/200' },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
      isRead: true,
   },
   {
      id: 'n24',
      type: 'story_like',
      actors: [
         {
            id: 's13',
            username: 'kettle.black',
            name: 'Fatima Al-Rashid',
            avatarUrl: 'https://picsum.photos/seed/fatima/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString(),
      isRead: true,
   },

   // Earlier
   {
      id: 'n25',
      type: 'follow',
      actors: [
         {
            id: 's14',
            username: 'loose.thread',
            name: 'Oliver Grant',
            avatarUrl: 'https://picsum.photos/seed/oliver/200/200',
         },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
      isRead: true,
   },
   {
      id: 'n26',
      type: 'like',
      actors: [
         {
            id: 's15',
            username: 'melted.wax',
            name: 'Isabela Rojas',
            avatarUrl: 'https://picsum.photos/seed/isabela/200/200',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona3/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
      isRead: true,
   },
   {
      id: 'n27',
      type: 'comment',
      actors: [
         {
            id: 's16',
            username: 'nickel.fern',
            name: 'Arjun Mehta',
            avatarUrl: 'https://picsum.photos/seed/arjun/200/200',
         },
      ],
      target: {
         id: '1',
         type: 'reel',
         thumbnailUrl: 'https://picsum.photos/seed/clona1/200/200',
      },
      message: 'Love the vibe here!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      isRead: true,
   },
   {
      id: 'n28',
      type: 'follow',
      actors: [
         { id: 's17', username: 'oxide.rust', name: 'Lea Müller', avatarUrl: 'https://picsum.photos/seed/lea/200/200' },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
      isRead: true,
   },
   {
      id: 'n29',
      type: 'mention',
      actors: [
         {
            id: 's18',
            username: 'prism.break',
            name: 'Kwame Asante',
            avatarUrl: 'https://picsum.photos/seed/kwame/200/200',
         },
      ],
      target: {
         id: 'c3',
         type: 'comment',
      },
      message: 'You have to see this @zivavu',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 55).toISOString(),
      isRead: true,
   },
   {
      id: 'n30',
      type: 'like',
      actors: [
         {
            id: 's19',
            username: 'quartz.dust',
            name: 'Nora Farsi',
            avatarUrl: 'https://picsum.photos/seed/nora/200/200',
         },
         {
            id: 's20',
            username: 'ripple.effect',
            name: 'Hugo Silva',
            avatarUrl: 'https://picsum.photos/seed/hugo/200/200',
         },
      ],
      target: {
         id: '2',
         type: 'post',
         thumbnailUrl: 'https://picsum.photos/seed/clona2/200/200',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      isRead: true,
   },
];
