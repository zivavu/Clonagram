import type { Media, PartialUser } from '@/src/types/global';

export interface Post {
   id: number;
   user: PartialUser;
   media: Media[];
   description: string;
   likesCount: number;
   repostsCount: number;
   commentsCount: number;
   createdAt: string;
}

export const POSTS: Post[] = [
   {
      id: 4,
      user: {
         id: '4',
         username: 'wanderlust',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona4.jpg',
      },
      media: [
         {
            id: '4a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona4a.jpg',
         },
         {
            id: '4b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona4b.jpg',
         },
         {
            id: '4c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona4c.jpg',
         },
      ],
      likesCount: 892,
      repostsCount: 45,
      description: 'weekend dump 🎞️',
      commentsCount: 23,
      createdAt: '2026-04-25T12:30:00Z',
   },
   {
      id: 5,
      user: {
         id: '5',
         username: 'neon.nights',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5.jpg',
      },
      media: [
         {
            id: '5a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5a.jpg',
         },
         {
            id: '5b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5b.jpg',
         },
         {
            id: '5c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5c.jpg',
         },
         {
            id: '5d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5d.jpg',
         },
         {
            id: '5e',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona5e.jpg',
         },
      ],
      likesCount: 2450,
      repostsCount: 120,
      description: 'tokyo after dark 🌃',
      commentsCount: 67,
      createdAt: '2026-04-25T11:15:00Z',
   },
   {
      id: 6,
      user: {
         id: '6',
         username: 'film.fatale',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6.jpg',
      },
      media: [
         {
            id: '6a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6a.jpg',
         },
         {
            id: '6b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6b.jpg',
         },
         {
            id: '6c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6c.jpg',
         },
         {
            id: '6d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6d.jpg',
         },
         {
            id: '6e',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6e.jpg',
         },
         {
            id: '6f',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6f.jpg',
         },
         {
            id: '6g',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona6g.jpg',
         },
      ],
      likesCount: 5678,
      repostsCount: 445,
      description: 'seven days of summer 🌊',
      commentsCount: 156,
      createdAt: '2026-04-25T10:00:00Z',
   },
   {
      id: 7,
      user: {
         id: '7',
         username: 'chrome.hearts',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7.jpg',
      },
      media: [
         {
            id: '7a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7a.jpg',
         },
         {
            id: '7b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7b.jpg',
         },
         {
            id: '7c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7c.jpg',
         },
         {
            id: '7d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7d.jpg',
         },
         {
            id: '7e',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7e.jpg',
         },
         {
            id: '7f',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7f.jpg',
         },
         {
            id: '7g',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7g.jpg',
         },
         {
            id: '7h',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7h.jpg',
         },
         {
            id: '7i',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona7i.jpg',
         },
      ],
      likesCount: 12034,
      repostsCount: 890,
      description: 'album drop. track by track 🎧',
      commentsCount: 312,
      createdAt: '2026-04-25T09:30:00Z',
   },
   {
      id: 8,
      user: {
         id: '8',
         username: 'synth.sunset',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona8.jpg',
      },
      media: [
         {
            id: '8a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona8a.jpg',
         },
         {
            id: '8b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona8b.jpg',
         },
         {
            id: '8c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona8c.jpg',
         },
      ],
      likesCount: 1456,
      repostsCount: 89,
      description: 'three moods, one afternoon 🍊',
      commentsCount: 41,
      createdAt: '2026-04-25T08:45:00Z',
   },
   {
      id: 9,
      user: {
         id: '9',
         username: 'grain.and.glow',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9.jpg',
      },
      media: [
         {
            id: '9a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9a.jpg',
         },
         {
            id: '9b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9b.jpg',
         },
         {
            id: '9c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9c.jpg',
         },
         {
            id: '9d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9d.jpg',
         },
         {
            id: '9e',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9e.jpg',
         },
         {
            id: '9f',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9f.jpg',
         },
         {
            id: '9g',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9g.jpg',
         },
         {
            id: '9h',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona9h.jpg',
         },
      ],
      likesCount: 3892,
      repostsCount: 234,
      description: 'behind the scenes 🎬',
      commentsCount: 98,
      createdAt: '2026-04-25T07:20:00Z',
   },
   {
      id: 10,
      user: {
         id: '10',
         username: 'analog.dreams',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona10.jpg',
      },
      media: [
         {
            id: '10a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona10a.jpg',
         },
         {
            id: '10b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona10b.jpg',
         },
         {
            id: '10c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona10c.jpg',
         },
         {
            id: '10d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona10d.jpg',
         },
      ],
      likesCount: 2103,
      repostsCount: 156,
      description: 'moments in between ✨',
      commentsCount: 72,
      createdAt: '2026-04-25T06:55:00Z',
   },
   {
      id: 11,
      user: {
         id: '11',
         username: 'midnight.archives',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11.jpg',
      },
      media: [
         {
            id: '11a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11a.jpg',
         },
         {
            id: '11b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11b.jpg',
         },
         {
            id: '11c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11c.jpg',
         },
         {
            id: '11d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11d.jpg',
         },
         {
            id: '11e',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11e.jpg',
         },
         {
            id: '11f',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona11f.jpg',
         },
      ],
      likesCount: 4567,
      repostsCount: 312,
      description: 'six stages of burnout 🔥',
      commentsCount: 134,
      createdAt: '2026-04-25T05:40:00Z',
   },
   {
      id: 12,
      user: {
         id: '12',
         username: 'coastal.static',
         avatar_url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12.jpg',
      },
      media: [
         {
            id: '12a',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12a.jpg',
         },
         {
            id: '12b',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12b.jpg',
         },
         {
            id: '12c',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12c.jpg',
         },
         {
            id: '12d',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12d.jpg',
         },
         {
            id: '12e',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12e.jpg',
         },
         {
            id: '12f',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12f.jpg',
         },
         {
            id: '12g',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12g.jpg',
         },
         {
            id: '12h',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12h.jpg',
         },
         {
            id: '12i',
            type: 'image',
            url: 'https://pggvzapkivjgsybyzjok.supabase.co/storage/v1/object/public/mock-images/clona12i.jpg',
         },
      ],
      likesCount: 7891,
      repostsCount: 567,
      description: 'coastal road trip 🌊🚐',
      commentsCount: 245,
      createdAt: '2026-04-25T04:15:00Z',
   },
];
