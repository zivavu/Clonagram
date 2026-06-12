'use client';

import { useState } from 'react';
import type { ProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import PostGrid from '@/src/components/PostGrid';
import type { PostWithMedia } from '@/src/queries/posts';
import ProfileTabs from '../ProfileTabs';

interface ProfileContentProps {
   posts: ProfileWithPosts['posts'];
   username: string;
   isOwnProfile: boolean;
   savedPosts?: PostWithMedia[];
}

export default function ProfileContent({
   posts,
   username,
   isOwnProfile,
   savedPosts,
}: ProfileContentProps) {
   const [activeTab, setActiveTab] = useState('posts');

   const reels = posts.filter(p => p.type === 'reel');

   return (
      <>
         <ProfileTabs
            isOwnProfile={isOwnProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
         />
         {activeTab === 'posts' && (
            <PostGrid posts={posts} username={username} emptyText="No posts yet" />
         )}
         {activeTab === 'reels' && (
            <PostGrid
               posts={reels}
               username={username}
               emptyText="No reels yet"
               alwaysShowPlayBadge
            />
         )}
         {activeTab === 'saved' && (
            <PostGrid posts={savedPosts ?? []} username={username} emptyText="No saved posts yet" />
         )}
      </>
   );
}
