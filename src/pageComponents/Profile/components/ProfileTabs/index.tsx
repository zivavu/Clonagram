'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { MdBookmarkBorder, MdGridOn, MdOutlinePlayCircle, MdPersonOutline } from 'react-icons/md';
import { TbRepeat } from 'react-icons/tb';
import { styles } from './index.stylex';

interface ProfileTabsProps {
   isOwnProfile: boolean;
}

interface Tab {
   id: string;
   icon: React.ReactNode;
}

export default function ProfileTabs({ isOwnProfile }: ProfileTabsProps) {
   const [activeTab, setActiveTab] = useState('posts');

   const commonTabs: Tab[] = [
      { id: 'posts', icon: <MdGridOn size={24} /> },
      { id: 'reels', icon: <MdOutlinePlayCircle size={24} /> },
      { id: 'reposts', icon: <TbRepeat size={24} /> },
      { id: 'tagged', icon: <MdPersonOutline size={24} /> },
   ];

   const ownTabs: Tab[] = [
      { id: 'posts', icon: <MdGridOn size={24} /> },
      { id: 'reels', icon: <MdOutlinePlayCircle size={24} /> },
      { id: 'saved', icon: <MdBookmarkBorder size={24} /> },
      { id: 'reposts', icon: <TbRepeat size={24} /> },
      { id: 'tagged', icon: <MdPersonOutline size={24} /> },
   ];

   const tabs = isOwnProfile ? ownTabs : commonTabs;

   return (
      <div {...stylex.props(styles.root)}>
         {tabs.map(tab => (
            <button
               key={tab.id}
               type="button"
               onClick={() => setActiveTab(tab.id)}
               {...stylex.props(styles.tab, activeTab === tab.id && styles.tabActive)}
            >
               <span {...stylex.props(styles.tabIcon)}>{tab.icon}</span>
            </button>
         ))}
      </div>
   );
}
