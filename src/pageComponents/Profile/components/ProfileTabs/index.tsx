'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { MdBookmarkBorder, MdGridOn, MdOutlinePlayCircle, MdPersonOutline } from 'react-icons/md';
import { TbRepeat } from 'react-icons/tb';
import { colors } from '../../../../styles/tokens.stylex';

interface ProfileTabsProps {
   isOwnProfile: boolean;
}

interface Tab {
   id: string;
   label: string;
   icon: React.ReactNode;
}

export default function ProfileTabs({ isOwnProfile }: ProfileTabsProps) {
   const [activeTab, setActiveTab] = useState('posts');

   const commonTabs: Tab[] = [
      { id: 'posts', label: 'POSTS', icon: <MdGridOn size={24} /> },
      { id: 'reels', label: 'REELS', icon: <MdOutlinePlayCircle size={24} /> },
      { id: 'reposts', label: 'REPOSTS', icon: <TbRepeat size={24} /> },
      { id: 'tagged', label: 'TAGGED', icon: <MdPersonOutline size={24} /> },
   ];

   const ownTabs: Tab[] = [
      { id: 'posts', label: 'POSTS', icon: <MdGridOn size={24} /> },
      { id: 'reels', label: 'REELS', icon: <MdOutlinePlayCircle size={24} /> },
      { id: 'saved', label: 'SAVED', icon: <MdBookmarkBorder size={24} /> },
      { id: 'reposts', label: 'REPOSTS', icon: <TbRepeat size={24} /> },
      { id: 'tagged', label: 'TAGGED', icon: <MdPersonOutline size={24} /> },
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
               <span {...stylex.props(styles.tabLabel)}>{tab.label}</span>
            </button>
         ))}
      </div>
   );
}

const styles = stylex.create({
   root: {
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      borderTop: `1px solid ${colors.separator}`,
      width: '100%',
   },
   tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      paddingTop: '16px',
      paddingBottom: '16px',
      borderTop: '1px solid transparent',
      marginTop: '-1px',
      color: colors.textSecondary,
      backgroundColor: 'transparent',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
   },
   tabActive: {
      borderTopColor: colors.textPrimary,
      color: colors.textPrimary,
   },
   tabIcon: {
      display: 'flex',
      alignItems: 'center',
   },
   tabLabel: {
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '1px',
   },
});
