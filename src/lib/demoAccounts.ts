import type { User } from '@supabase/supabase-js';

export const demoAccounts = [
   { email: 'example1@example.com', username: 'demo_alex', fullName: 'Alex Demo' },
   { email: 'example2@example.com', username: 'demo_maya', fullName: 'Maya Demo' },
   { email: 'example3@example.com', username: 'demo_leo', fullName: 'Leo Demo' },
   { email: 'example4@example.com', username: 'demo_nina', fullName: 'Nina Demo' },
   { email: 'example5@example.com', username: 'demo_sam', fullName: 'Sam Demo' },
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
