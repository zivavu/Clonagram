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
            full_name: 'Luna Marchetti',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/luna.jpg',
         },
         {
            id: 's2',
            username: 'static.signal',
            full_name: 'Elias Voss',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/elias.jpg',
         },
      ],
      target: {
         id: '1',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona1.jpg',
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
            full_name: 'Maya Okonkwo',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/maya.jpg',
         },
         {
            id: 's4',
            username: 'nocturne.moth',
            full_name: 'Clara Bisset',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clara.jpg',
         },
      ],
      target: {
         id: '2',
         type: 'reel',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona2.jpg',
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
            full_name: 'Dariel Kim',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/dariel.jpg',
         },
      ],
      target: {
         id: '1',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona1.jpg',
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
            full_name: 'Sofia Lindgren',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/sofia.jpg',
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
            full_name: 'James Okoro',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/james.jpg',
         },
         {
            id: 's8',
            username: 'fragment.studio',
            full_name: 'Aiko Tanaka',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/aiko.jpg',
         },
         {
            id: 's9',
            username: 'gravel.path',
            full_name: 'Marcus Webb',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/marcus.jpg',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona3.jpg',
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
            full_name: 'Priya Desai',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/priya.jpg',
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
            full_name: 'Tommaso Bianchi',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/tommaso.jpg',
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
         {
            id: 's12',
            username: 'jade.petal',
            full_name: 'Yuki Chen',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/yuki.jpg',
         },
         {
            id: 's13',
            username: 'kettle.black',
            full_name: 'Fatima Al-Rashid',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/fatima.jpg',
         },
      ],
      target: {
         id: '1',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona1.jpg',
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
            full_name: 'Oliver Grant',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/oliver.jpg',
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
            full_name: 'Isabela Rojas',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/isabela.jpg',
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
            full_name: 'Arjun Mehta',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/arjun.jpg',
         },
      ],
      target: {
         id: '4',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona4.jpg',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      isRead: true,
   },
   {
      id: 'n12',
      type: 'comment',
      actors: [
         {
            id: 's17',
            username: 'oxide.rust',
            full_name: 'Lea Müller',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/lea.jpg',
         },
      ],
      target: {
         id: '2',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona2.jpg',
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
            full_name: 'Kwame Asante',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/kwame.jpg',
         },
         {
            id: 's19',
            username: 'quartz.dust',
            full_name: 'Nora Farsi',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/nora.jpg',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona3.jpg',
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
            full_name: 'Hugo Silva',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/hugo.jpg',
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
            full_name: 'Luna Marchetti',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/luna.jpg',
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
            full_name: 'Elias Voss',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/elias.jpg',
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
            full_name: 'Maya Okonkwo',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/maya.jpg',
         },
      ],
      target: {
         id: '1',
         type: 'reel',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona1.jpg',
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
            full_name: 'Clara Bisset',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clara.jpg',
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
            full_name: 'Dariel Kim',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/dariel.jpg',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona3.jpg',
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
            full_name: 'Sofia Lindgren',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/sofia.jpg',
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
            full_name: 'James Okoro',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/james.jpg',
         },
         {
            id: 's8',
            username: 'fragment.studio',
            full_name: 'Aiko Tanaka',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/aiko.jpg',
         },
         {
            id: 's9',
            username: 'gravel.path',
            full_name: 'Marcus Webb',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/marcus.jpg',
         },
         {
            id: 's10',
            username: 'hollow.shell',
            full_name: 'Priya Desai',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/priya.jpg',
         },
      ],
      target: {
         id: '2',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona2.jpg',
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
            full_name: 'Tommaso Bianchi',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/tommaso.jpg',
         },
      ],
      target: {
         id: '5',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5.jpg',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 27).toISOString(),
      isRead: true,
   },
   {
      id: 'n23',
      type: 'follow',
      actors: [
         {
            id: 's12',
            username: 'jade.petal',
            full_name: 'Yuki Chen',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/yuki.jpg',
         },
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
            full_name: 'Fatima Al-Rashid',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/fatima.jpg',
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
            full_name: 'Oliver Grant',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/oliver.jpg',
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
            full_name: 'Isabela Rojas',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/isabela.jpg',
         },
      ],
      target: {
         id: '3',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona3.jpg',
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
            full_name: 'Arjun Mehta',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/arjun.jpg',
         },
      ],
      target: {
         id: '1',
         type: 'reel',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona1.jpg',
      },
      message: 'Love the vibe here!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      isRead: true,
   },
   {
      id: 'n28',
      type: 'follow',
      actors: [
         {
            id: 's17',
            username: 'oxide.rust',
            full_name: 'Lea Müller',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/lea.jpg',
         },
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
            full_name: 'Kwame Asante',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/kwame.jpg',
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
            full_name: 'Nora Farsi',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/nora.jpg',
         },
         {
            id: 's20',
            username: 'ripple.effect',
            full_name: 'Hugo Silva',
            avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/hugo.jpg',
         },
      ],
      target: {
         id: '2',
         type: 'post',
         thumbnailUrl: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona2.jpg',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      isRead: true,
   },
];
