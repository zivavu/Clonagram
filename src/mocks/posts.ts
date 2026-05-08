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
         avatar_url: 'https://picsum.photos/seed/clona4/630/630',
      },
      media: [
         {
            id: '4a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona4a/630/630',
         },
         {
            id: '4b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona4b/630/630',
         },
         {
            id: '4c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona4c/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona5/630/630',
      },
      media: [
         {
            id: '5a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona5a/630/630',
         },
         {
            id: '5b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona5b/630/630',
         },
         {
            id: '5c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona5c/630/630',
         },
         {
            id: '5d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona5d/630/630',
         },
         {
            id: '5e',
            type: 'image',
            url: 'https://picsum.photos/seed/clona5e/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona6/630/630',
      },
      media: [
         {
            id: '6a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6a/630/630',
         },
         {
            id: '6b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6b/630/630',
         },
         {
            id: '6c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6c/630/630',
         },
         {
            id: '6d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6d/630/630',
         },
         {
            id: '6e',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6e/630/630',
         },
         {
            id: '6f',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6f/630/630',
         },
         {
            id: '6g',
            type: 'image',
            url: 'https://picsum.photos/seed/clona6g/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona7/630/630',
      },
      media: [
         {
            id: '7a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7a/630/630',
         },
         {
            id: '7b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7b/630/630',
         },
         {
            id: '7c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7c/630/630',
         },
         {
            id: '7d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7d/630/630',
         },
         {
            id: '7e',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7e/630/630',
         },
         {
            id: '7f',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7f/630/630',
         },
         {
            id: '7g',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7g/630/630',
         },
         {
            id: '7h',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7h/630/630',
         },
         {
            id: '7i',
            type: 'image',
            url: 'https://picsum.photos/seed/clona7i/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona8/630/630',
      },
      media: [
         {
            id: '8a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona8a/630/630',
         },
         {
            id: '8b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona8b/630/630',
         },
         {
            id: '8c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona8c/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona9/630/630',
      },
      media: [
         {
            id: '9a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9a/630/630',
         },
         {
            id: '9b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9b/630/630',
         },
         {
            id: '9c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9c/630/630',
         },
         {
            id: '9d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9d/630/630',
         },
         {
            id: '9e',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9e/630/630',
         },
         {
            id: '9f',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9f/630/630',
         },
         {
            id: '9g',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9g/630/630',
         },
         {
            id: '9h',
            type: 'image',
            url: 'https://picsum.photos/seed/clona9h/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona10/630/630',
      },
      media: [
         {
            id: '10a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona10a/630/630',
         },
         {
            id: '10b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona10b/630/630',
         },
         {
            id: '10c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona10c/630/630',
         },
         {
            id: '10d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona10d/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona11/630/630',
      },
      media: [
         {
            id: '11a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona11a/630/630',
         },
         {
            id: '11b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona11b/630/630',
         },
         {
            id: '11c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona11c/630/630',
         },
         {
            id: '11d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona11d/630/630',
         },
         {
            id: '11e',
            type: 'image',
            url: 'https://picsum.photos/seed/clona11e/630/630',
         },
         {
            id: '11f',
            type: 'image',
            url: 'https://picsum.photos/seed/clona11f/630/630',
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
         avatar_url: 'https://picsum.photos/seed/clona12/630/630',
      },
      media: [
         {
            id: '12a',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12a/630/630',
         },
         {
            id: '12b',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12b/630/630',
         },
         {
            id: '12c',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12c/630/630',
         },
         {
            id: '12d',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12d/630/630',
         },
         {
            id: '12e',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12e/630/630',
         },
         {
            id: '12f',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12f/630/630',
         },
         {
            id: '12g',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12g/630/630',
         },
         {
            id: '12h',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12h/630/630',
         },
         {
            id: '12i',
            type: 'image',
            url: 'https://picsum.photos/seed/clona12i/630/630',
         },
      ],
      likesCount: 7891,
      repostsCount: 567,
      description: 'coastal road trip 🌊🚐',
      commentsCount: 245,
      createdAt: '2026-04-25T04:15:00Z',
   },
];
