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
import { useAuthUser } from '../../../../../../hooks/useAuthUser';
import type { PostLocation, PostMedia, PostSettings } from '../../../../types';
import Toggle from '../Toggle';
import { styles } from './index.stylex';

const MAX_CAPTION = 2200;

interface CaptionPanelProps {
   caption: string;
   onCaptionChange: (caption: string) => void;
   location: PostLocation | null;
   onLocationChange: (location: PostLocation | null) => void;
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
   const { data: userData } = useAuthUser();

   const [collabOpen, setCollabOpen] = useState(false);
   const [shareToOpen, setShareToOpen] = useState(false);
   const [accessibilityOpen, setAccessibilityOpen] = useState(false);
   const [advancedOpen, setAdvancedOpen] = useState(false);

   const updateSettings = (updates: Partial<PostSettings>) => {
      onPostSettingsChange({ ...postSettings, ...updates });
   };

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
            <div {...stylex.props(styles.userRow)}>
               <UserAvatar
                  alt="Your profile image"
                  size={30}
                  src={userData?.user_metadata?.avatar_url}
               />
               <span>zivavu</span>
            </div>
            <textarea
               {...stylex.props(styles.textarea)}
               placeholder="Write a caption..."
               maxLength={MAX_CAPTION}
               rows={8}
               value={caption}
               onChange={e => onCaptionChange(e.target.value)}
            />
            <div {...stylex.props(styles.captionRowBottom)}>
               <button type="button" {...stylex.props(styles.emojiButton)} aria-label="Add emoji">
                  <MdOutlineEmojiEmotions style={{ fontSize: 22 }} />
               </button>
               <span {...stylex.props(styles.charCount)}>
                  {caption.length}/{MAX_CAPTION}
               </span>
            </div>
         </div>

         <LocationAutocomplete value={location} onChange={onLocationChange} />

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

         <CollapsibleSection
            title="Share to"
            open={shareToOpen}
            onToggle={() => setShareToOpen(o => !o)}
         >
            <div {...stylex.props(styles.shareRow)}>
               <UserAvatar src={CURRENT_USER.avatar_url} alt={CURRENT_USER.username} size={36} />
               <div {...stylex.props(styles.shareInfo)}>
                  <span {...stylex.props(styles.shareName)}>{CURRENT_USER.username}</span>
                  <span {...stylex.props(styles.shareMeta)}>Clonedbook · Public</span>
               </div>
               <Toggle
                  checked={postSettings.shareToClonedbook}
                  onChange={v => updateSettings({ shareToClonedbook: v })}
               />
            </div>
         </CollapsibleSection>

         <CollapsibleSection
            title="Accessibility"
            open={accessibilityOpen}
            onToggle={() => setAccessibilityOpen(o => !o)}
         >
            <p {...stylex.props(styles.accessibilityDesc)}>
               Alt text describes your photos for people with visual impairments. Alt text will be
               automatically created for your photos or you can choose to write your own.
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
         </CollapsibleSection>

         <CollapsibleSection
            title="Advanced settings"
            open={advancedOpen}
            onToggle={() => setAdvancedOpen(o => !o)}
         >
            <SettingRow
               title="Hide like and view counts on this post"
               description={
                  <>
                     Only you will see the total number of likes and views on this post. You can
                     change this later by going to the ··· menu at the top of the post.{' '}
                     <Link href="#" {...stylex.props(styles.settingLink)}>
                        Learn more
                     </Link>
                  </>
               }
               checked={postSettings.hideLikes}
               onChange={v => updateSettings({ hideLikes: v })}
            />
            <SettingRow
               title="Turn off commenting"
               description="You can change this later by going to the ··· menu at the top of your post."
               checked={postSettings.commentsOff}
               onChange={v => updateSettings({ commentsOff: v })}
            />
         </CollapsibleSection>
      </div>
   );
}

interface CollapsibleSectionProps {
   title: string;
   open: boolean;
   onToggle: () => void;
   children: React.ReactNode;
}

function CollapsibleSection({ title, open, onToggle, children }: CollapsibleSectionProps) {
   return (
      <>
         <button type="button" {...stylex.props(styles.sectionHeader)} onClick={onToggle}>
            <span {...stylex.props(styles.sectionTitle)}>{title}</span>
            <MdExpandMore {...stylex.props(styles.chevron, open && styles.chevronOpen)} />
         </button>
         {open && <div {...stylex.props(styles.sectionContent)}>{children}</div>}
      </>
   );
}

interface SettingRowProps {
   title: string;
   description: React.ReactNode;
   checked: boolean;
   onChange: (value: boolean) => void;
}

function SettingRow({ title, description, checked, onChange }: SettingRowProps) {
   return (
      <div {...stylex.props(styles.settingRow)}>
         <div {...stylex.props(styles.settingText)}>
            <span {...stylex.props(styles.settingTitle)}>{title}</span>
            <span {...stylex.props(styles.settingDesc)}>{description}</span>
         </div>
         <Toggle checked={checked} onChange={onChange} />
      </div>
   );
}
