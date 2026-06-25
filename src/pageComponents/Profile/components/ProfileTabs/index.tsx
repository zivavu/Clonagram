'use client';

import * as stylex from '@stylexjs/stylex';
import { MdBookmarkBorder, MdGridOn, MdOutlinePlayCircle, MdPersonOutline } from 'react-icons/md';
import { TbRepeat } from 'react-icons/tb';
import { styles } from './index.stylex';

interface ProfileTabsProps {
   isOwnProfile: boolean;
   activeTab: string;
   onTabChange: (tab: string) => void;
}

interface Tab {
   id: string;
   label: string;
   icon: React.ReactNode;
}

export default function ProfileTabs({ isOwnProfile, activeTab, onTabChange }: ProfileTabsProps) {
   const commonTabs: Tab[] = [
      { id: 'posts', label: 'Posts', icon: <MdGridOn size={24} /> },
      { id: 'reels', label: 'Reels', icon: <MdOutlinePlayCircle size={24} /> },
      { id: 'reposts', label: 'Reposts', icon: <TbRepeat size={24} /> },
      { id: 'tagged', label: 'Tagged', icon: <MdPersonOutline size={24} /> },
   ];

   const ownTabs: Tab[] = [
      { id: 'posts', label: 'Posts', icon: <MdGridOn size={24} /> },
      { id: 'reels', label: 'Reels', icon: <MdOutlinePlayCircle size={24} /> },
      { id: 'saved', label: 'Saved', icon: <MdBookmarkBorder size={24} /> },
      { id: 'reposts', label: 'Reposts', icon: <TbRepeat size={24} /> },
      { id: 'tagged', label: 'Tagged', icon: <MdPersonOutline size={24} /> },
   ];

   const tabs = isOwnProfile ? ownTabs : commonTabs;

   return (
      <div {...stylex.props(styles.root)}>
         {tabs.map(tab => (
            <button
               key={tab.id}
               type="button"
               aria-label={tab.label}
               onClick={() => onTabChange(tab.id)}
               {...stylex.props(styles.tab, activeTab === tab.id && styles.tabActive)}
            >
               <span {...stylex.props(styles.tabIcon)}>{tab.icon}</span>
            </button>
         ))}
      </div>
   );
}
