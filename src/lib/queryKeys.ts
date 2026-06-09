export const queryKeys = {
   authUser: () => ['authUser'] as const,
   post: (id: string) => ['post', id] as const,
   postForEdit: (id: string) => ['post-for-edit', id] as const,
   comments: (postId: string) => ['comments', postId] as const,
   replies: (parentId: string) => ['replies', parentId] as const,
   reels: () => ['reels'] as const,
   profileSearch: (query: string, userId?: string) =>
      userId
         ? (['profiles', 'search', query, userId] as const)
         : (['profiles', 'search', query] as const),
   profileCard: (userId: string) => ['profile-card', userId] as const,
   profileRecentPosts: (userId: string) => ['profile-recent-posts', userId] as const,
   storyStatus: (userId: string) => ['storyStatus', userId] as const,
   notifications: (userId: string) => ['notifications', userId] as const,
   conversations: (folder?: string, userId?: string) =>
      folder && userId
         ? (['conversations', folder, userId] as const)
         : (['conversations'] as const),
   conversationRequests: (userId: string) => ['conversations', 'requests', userId] as const,
   conversation: (conversationId: string) => ['conversation', conversationId] as const,
   messages: (conversationId: string) => ['messages', conversationId] as const,
   homeFeed: (variant: 'home' | 'following') => ['home-feed', variant] as const,
   followedUsers: () => ['followed-users'] as const,
   userSearch: (query: string) => ['user-search', query] as const,
   locationSearch: (query: string) => ['locations', 'search', query] as const,
};
