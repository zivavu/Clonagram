import type { User } from '@supabase/supabase-js';

export const demoAccounts = [
   {
      email: 'example1@example.com',
      username: 'demo_alex',
      fullName: 'Alex Demo',
      avatar: '/demoAvatars/demo_alex.webp',
      avatarSourcePhoto: 'ali-pazani-LzyQ3WV_-pc-unsplash.jpg',
   },
   {
      email: 'example2@example.com',
      username: 'demo_maya',
      fullName: 'Maya Demo',
      avatar: '/demoAvatars/demo_maya.webp',
      avatarSourcePhoto: 'virginia-berbece-GCmqm5q4AgY-unsplash.jpg',
   },
   {
      email: 'example3@example.com',
      username: 'demo_leo',
      fullName: 'Leo Demo',
      avatar: '/demoAvatars/demo_leo.webp',
      avatarSourcePhoto: 'connor-botts-k6rQYHBIAfs-unsplash.jpg',
   },
   {
      email: 'example4@example.com',
      username: 'demo_nina',
      fullName: 'Nina Demo',
      avatar: '/demoAvatars/demo_nina.webp',
      avatarSourcePhoto: 'see-plus-NP3s9BYOqAc-unsplash.jpg',
   },
   {
      email: 'example5@example.com',
      username: 'demo_zoe',
      fullName: 'Zoe Demo',
      avatar: '/demoAvatars/demo_zoe.webp',
      avatarSourcePhoto: 'brooke-cagle-oTweoxMKdkA-unsplash.jpg',
   },
] as const;

export type DemoAccount = (typeof demoAccounts)[number];

const demoAccountEmails = new Set<string>(demoAccounts.map(account => account.email));

export function isDemoAccount(user: Pick<User, 'email'> | null) {
   return !!user?.email && demoAccountEmails.has(user.email.toLowerCase());
}

export function assertNotDemoAccount(user: Pick<User, 'email'>) {
   if (isDemoAccount(user)) {
      throw new Error('This action is disabled for shared demo accounts.');
   }
}
