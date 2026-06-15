export const staleTime = {
   default: 30_000,
   infinite: 0,
   static: Infinity,
};

export const queryKeys = {
   authUser: () => ['authUser'] as const,
   post: (id: string) => ['post', id] as const,
   postForEdit: (id: string) => ['post-for-edit', id] as const,
   comments: (postId: string) => ['comments', postId] as const,
   replies: (parentId: string) => ['replies', parentId] as const,
   reels: () => ['reels'] as const,
   profileSearch: (query: string, userId?: string) =>
      ['profiles', 'search', query, userId ?? null] as const,
   profileCard: (userId: string) => ['profile-card', userId] as const,
   profileRecentPosts: (userId: string, hideAi?: boolean) =>
      ['profile-recent-posts', userId, hideAi ?? false] as const,
   storyStatus: (userId: string) => ['storyStatus', userId] as const,
   notifications: (userId: string) => ['notifications', userId] as const,
   allConversations: () => ['conversations'] as const,
   conversations: (folder?: string, userId?: string) =>
      ['conversations', folder ?? null, userId ?? null] as const,
   conversationRequests: (userId: string) => ['conversations', 'requests', userId] as const,
   conversation: (conversationId: string) => ['conversation', conversationId] as const,
   messages: (conversationId: string) => ['messages', conversationId] as const,
   homeFeed: (variant: 'home' | 'following') => ['home-feed', variant] as const,
   explore: (variant: 'for_you' | 'nonpersonalized') => ['explore', variant] as const,
   followedUsers: () => ['followed-users'] as const,
   userSearch: (query: string) => ['user-search', query] as const,
   locationSearch: (query: string) => ['locations', 'search', query] as const,
   profileStats: (userId: string) => ['profile-stats', userId] as const,
};
