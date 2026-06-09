'use client';

import { useState } from 'react';
import type { ProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import type { PostWithMedia } from '../../../../queries/posts';
import ProfilePostGrid from '../ProfilePostGrid';
import ProfileReelsGrid from '../ProfileReelsGrid';
import ProfileSavedGrid from '../ProfileSavedGrid';
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
         {activeTab === 'posts' && <ProfilePostGrid posts={posts} username={username} />}
         {activeTab === 'reels' && <ProfileReelsGrid reels={reels} username={username} />}
         {activeTab === 'saved' && (
            <ProfileSavedGrid posts={savedPosts ?? []} username={username} />
         )}
      </>
   );
}
