'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useState } from 'react';
import { IoPersonAddOutline } from 'react-icons/io5';
import { MdExpandMore, MdOutlineEmojiEmotions } from 'react-icons/md';
import LocationAutocomplete from '@/src/components/LocationAutocomplete';
import UserAutocomplete from '@/src/components/UserAutocomplete';
import UserAvatar from '@/src/components/UserAvatar';
import { CURRENT_USER } from '@/src/mocks/users';
import type { PartialUser } from '@/src/types/global';
import type { PostMedia, PostSettings } from '../../../../types';
import Toggle from '../Toggle';
import { styles } from './index.stylex';

const MAX_CAPTION = 2200;

interface CaptionPanelProps {
   caption: string;
   onCaptionChange: (caption: string) => void;
   location: string | null;
   onLocationChange: (location: string | null) => void;
   collaborators: PartialUser[];
   onCollaboratorsChange: (collaborators: PartialUser[]) => void;
   postSettings: PostSettings;
   onPostSettingsChange: (settings: PostSettings) => void;
   files: PostMedia[];
}

export default function CaptionPanel({
   caption,
   onCaptionChange,
   location,
   onLocationChange,
   collaborators,
   onCollaboratorsChange,
   postSettings,
   onPostSettingsChange,
   files,
}: CaptionPanelProps) {
   const [collabOpen, setCollabOpen] = useState(false);
   const [shareToOpen, setShareToOpen] = useState(true);
   const [accessibilityOpen, setAccessibilityOpen] = useState(false);
   const [advancedOpen, setAdvancedOpen] = useState(true);
   const [autoShareThreads, setAutoShareThreads] = useState(false);
   const [autoShareFacebook, setAutoShareFacebook] = useState(false);
   const [autoShareClonedbook, setAutoShareClonedbook] = useState(false);

   const handleCollabToggle = (user: PartialUser) => {
      if (collaborators.some(c => c.id === user.id)) {
         onCollaboratorsChange(collaborators.filter(c => c.id !== user.id));
      } else {
         onCollaboratorsChange([...collaborators, user]);
      }
   };

   return (
      <div {...stylex.props(styles.panel)}>
         <div {...stylex.props(styles.captionSection)}>
            <div {...stylex.props(styles.captionRow)}>
               <button type="button" {...stylex.props(styles.emojiButton)} aria-label="Add emoji">
                  <MdOutlineEmojiEmotions style={{ fontSize: 22 }} />
               </button>
               <textarea
                  {...stylex.props(styles.textarea)}
                  placeholder="Write a caption..."
                  maxLength={MAX_CAPTION}
                  value={caption}
                  onChange={e => onCaptionChange(e.target.value)}
               />
            </div>
            <span {...stylex.props(styles.charCount)}>
               {caption.length}/{MAX_CAPTION}
            </span>
         </div>

         <div {...stylex.props(styles.divider)} />
         <LocationAutocomplete value={location} onChange={onLocationChange} />

         <div {...stylex.props(styles.divider)} />
         {collabOpen ? (
            <UserAutocomplete
               multiSelect
               selected={collaborators}
               onSelect={handleCollabToggle}
               onDone={() => setCollabOpen(false)}
               onDismiss={() => setCollabOpen(false)}
               placeholder="Search..."
               autoFocus
            />
         ) : (
            <button
               type="button"
               {...stylex.props(styles.addRow)}
               onClick={() => setCollabOpen(true)}
            >
               {collaborators.length > 0 ? (
                  <div {...stylex.props(styles.collabAvatars)}>
                     {collaborators.slice(0, 3).map(c => (
                        <div key={c.id} {...stylex.props(styles.collabAvatarWrap)}>
                           <UserAvatar src={c.avatar_url} alt={c.username} size={28} />
                        </div>
                     ))}
                     {collaborators.length > 3 && (
                        <span {...stylex.props(styles.collabCount)}>
                           +{collaborators.length - 3}
                        </span>
                     )}
                  </div>
               ) : (
                  <span {...stylex.props(styles.addRowLabel)}>Add collaborators</span>
               )}
               <IoPersonAddOutline style={{ fontSize: 20, opacity: 0.7 }} />
            </button>
         )}

         <div {...stylex.props(styles.divider)} />
         <button
            type="button"
            {...stylex.props(styles.sectionHeader)}
            onClick={() => setShareToOpen(o => !o)}
         >
            <span {...stylex.props(styles.sectionTitle)}>Share to</span>
            <MdExpandMore {...stylex.props(styles.chevron, shareToOpen && styles.chevronOpen)} />
         </button>
         {shareToOpen && (
            <div {...stylex.props(styles.sectionContent)}>
               <div {...stylex.props(styles.shareRow)}>
                  <UserAvatar src={CURRENT_USER.avatar_url} alt={CURRENT_USER.username} size={36} />
                  <div {...stylex.props(styles.shareInfo)}>
                     <span {...stylex.props(styles.shareName)}>{CURRENT_USER.username}</span>
                     <span {...stylex.props(styles.shareMeta)}>Clonedbook · Public</span>
                  </div>
                  <Toggle
                     checked={postSettings.shareToClonedbook}
                     onChange={v => onPostSettingsChange({ ...postSettings, shareToClonedbook: v })}
                  />
               </div>
            </div>
         )}

         <div {...stylex.props(styles.divider)} />
         <button
            type="button"
            {...stylex.props(styles.sectionHeader)}
            onClick={() => setAccessibilityOpen(o => !o)}
         >
            <span {...stylex.props(styles.sectionTitle)}>Accessibility</span>
            <MdExpandMore
               {...stylex.props(styles.chevron, accessibilityOpen && styles.chevronOpen)}
            />
         </button>
         {accessibilityOpen && (
            <div {...stylex.props(styles.sectionContent)}>
               <p {...stylex.props(styles.accessibilityDesc)}>
                  Alt text describes your photos for people with visual impairments. Alt text will
                  be automatically created for your photos or you can choose to write your own.
               </p>
               {files.map((file, idx) => (
                  <div key={file.preview} {...stylex.props(styles.altRow)}>
                     {/* biome-ignore lint/performance/noImgElement: small fixed-size thumbnail */}
                     <img
                        src={file.preview}
                        alt={`Thumbnail ${idx + 1}`}
                        {...stylex.props(styles.altThumb)}
                     />
                     <input
                        type="text"
                        placeholder="Write alt text..."
                        {...stylex.props(styles.altInput)}
                     />
                  </div>
               ))}
            </div>
         )}

         <div {...stylex.props(styles.divider)} />
         <button
            type="button"
            {...stylex.props(styles.sectionHeader)}
            onClick={() => setAdvancedOpen(o => !o)}
         >
            <span {...stylex.props(styles.sectionTitle)}>Advanced settings</span>
            <MdExpandMore {...stylex.props(styles.chevron, advancedOpen && styles.chevronOpen)} />
         </button>
         {advancedOpen && (
            <div {...stylex.props(styles.sectionContent)}>
               <div {...stylex.props(styles.settingRow)}>
                  <div {...stylex.props(styles.settingText)}>
                     <span {...stylex.props(styles.settingTitle)}>
                        Hide like and view counts on this post
                     </span>
                     <span {...stylex.props(styles.settingDesc)}>
                        Only you will see the total number of likes and views on this post. You can
                        change this later by going to the ··· menu at the top of the post.{' '}
                        <Link href="#" {...stylex.props(styles.settingLink)}>
                           Learn more
                        </Link>
                     </span>
                  </div>
                  <Toggle
                     checked={postSettings.hideLikes}
                     onChange={v => onPostSettingsChange({ ...postSettings, hideLikes: v })}
                  />
               </div>
               <div {...stylex.props(styles.settingRow)}>
                  <div {...stylex.props(styles.settingText)}>
                     <span {...stylex.props(styles.settingTitle)}>Turn off commenting</span>
                     <span {...stylex.props(styles.settingDesc)}>
                        You can change this later by going to the ··· menu at the top of your post.
                     </span>
                  </div>
                  <Toggle
                     checked={postSettings.commentsOff}
                     onChange={v => onPostSettingsChange({ ...postSettings, commentsOff: v })}
                  />
               </div>
               <div {...stylex.props(styles.settingRow)}>
                  <div {...stylex.props(styles.settingText)}>
                     <span {...stylex.props(styles.settingTitle)}>
                        Automatically share to Threads
                     </span>
                     <span {...stylex.props(styles.settingDesc)}>
                        Always share your posts to Threads. You can change your audience on Threads
                        settings.{' '}
                        <Link href="#" {...stylex.props(styles.settingLink)}>
                           Learn more
                        </Link>
                     </span>
                  </div>
                  <Toggle checked={autoShareThreads} onChange={setAutoShareThreads} />
               </div>
               <div {...stylex.props(styles.settingRow)}>
                  <div {...stylex.props(styles.settingText)}>
                     <span {...stylex.props(styles.settingTitle)}>
                        Automatically share to Facebook
                     </span>
                     <span {...stylex.props(styles.settingDesc)}>
                        Always share your posts to Facebook. You can change your audience on
                        Facebook settings.{' '}
                        <Link href="#" {...stylex.props(styles.settingLink)}>
                           Learn more
                        </Link>
                     </span>
                  </div>
                  <Toggle checked={autoShareFacebook} onChange={setAutoShareFacebook} />
               </div>
               <div {...stylex.props(styles.settingRow)}>
                  <div {...stylex.props(styles.settingText)}>
                     <span {...stylex.props(styles.settingTitle)}>
                        Automatically share to Clonedbook
                     </span>
                     <span {...stylex.props(styles.settingDesc)}>
                        Always share your posts to Clonedbook. You can change your audience on
                        Clonedbook settings.
                     </span>
                  </div>
                  <Toggle checked={autoShareClonedbook} onChange={setAutoShareClonedbook} />
               </div>
            </div>
         )}
      </div>
   );
}
