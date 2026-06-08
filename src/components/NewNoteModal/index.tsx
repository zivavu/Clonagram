'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { BsPeopleFill } from 'react-icons/bs';
import { IoChevronDownSharp, IoClose } from 'react-icons/io5';
import { createNoteAction } from '@/src/actions/notes/createNote';
import { deleteNoteAction } from '@/src/actions/notes/deleteNote';
import DialogOverlay from '@/src/components/DialogOverlay';
import { useNewNoteModalStore } from '@/src/store/createModalStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import type { Profile } from '../../lib/supabase/getAuthProfile';
import { styles } from './index.stylex';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const MAX_LENGTH = 60;

interface NewNoteModalProps {
   currentUser: Profile;
   ownNote: string | null;
}

export default function NewNoteModal({ currentUser, ownNote }: NewNoteModalProps) {
   const { isOpen, close } = useNewNoteModalStore();
   const isDark = useThemeStore(s => s.isDark);
   const router = useRouter();
   const [text, setText] = useState(ownNote ?? '');
   const [pickerOpen, setPickerOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const handleOpenChange = (open: boolean) => {
      if (open) {
         setText(ownNote ?? '');
      } else {
         setPickerOpen(false);
         close();
      }
   };

   const handleEmojiClick = (data: EmojiClickData) => {
      const emoji = data.emoji;
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart ?? text.length;
      const end = el.selectionEnd ?? text.length;
      const newText = text.slice(0, start) + emoji + text.slice(end);
      if (newText.length <= MAX_LENGTH) {
         setText(newText);
         requestAnimationFrame(() => {
            el.selectionStart = start + emoji.length;
            el.selectionEnd = start + emoji.length;
            el.focus();
         });
      }
      setPickerOpen(false);
   };

   const handleShare = async () => {
      if (!text.trim() || loading) return;
      setLoading(true);
      try {
         await createNoteAction(text.trim());
         router.refresh();
         close();
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async () => {
      if (loading) return;
      setLoading(true);
      try {
         await deleteNoteAction();
         router.refresh();
         setText('');
         close();
      } finally {
         setLoading(false);
      }
   };

   const remaining = MAX_LENGTH - text.length;

   return (
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content
               {...stylex.props(styles.content)}
               onEscapeKeyDown={() => {
                  setPickerOpen(false);
                  close();
               }}
               aria-describedby={undefined}
            >
               <Dialog.Title style={{ display: 'none' }}>New note</Dialog.Title>

               <div {...stylex.props(styles.header)}>
                  <button
                     type="button"
                     {...stylex.props(styles.closeButton)}
                     onClick={close}
                     aria-label="Close"
                  >
                     <IoClose size={24} />
                  </button>
                  <span {...stylex.props(styles.title)}>New note</span>
                  <button
                     type="button"
                     {...stylex.props(styles.shareButton)}
                     onClick={handleShare}
                     disabled={!text.trim() || loading}
                  >
                     Share
                  </button>
               </div>

               <div {...stylex.props(styles.body)}>
                  <textarea
                     ref={textareaRef}
                     {...stylex.props(styles.textarea)}
                     placeholder="Share a thought..."
                     value={text}
                     maxLength={MAX_LENGTH}
                     rows={3}
                     onChange={e => setText(e.target.value)}
                     autoFocus
                  />

                  {currentUser?.avatar_url ? (
                     <div {...stylex.props(styles.avatarWrapper)}>
                        <Image
                           src={currentUser.avatar_url}
                           alt="Your avatar"
                           width={120}
                           height={120}
                           style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                     </div>
                  ) : (
                     <div {...stylex.props(styles.avatarPlaceholder)} />
                  )}

                  <button
                     type="button"
                     {...stylex.props(styles.emojiButton)}
                     onClick={() => setPickerOpen(v => !v)}
                     aria-label="Pick emoji"
                  >
                     <AiOutlineSmile />
                  </button>

                  {text.length > 40 && (
                     <span
                        {...stylex.props(
                           styles.charCount,
                           remaining <= 5 && styles.charCountWarning,
                        )}
                     >
                        {remaining}
                     </span>
                  )}

                  {pickerOpen && (
                     <div {...stylex.props(styles.emojiPickerWrapper)}>
                        <EmojiPicker
                           onEmojiClick={handleEmojiClick}
                           theme={isDark ? Theme.DARK : Theme.LIGHT}
                           emojiStyle={EmojiStyle.FACEBOOK}
                           height={350}
                           width={300}
                        />
                     </div>
                  )}
               </div>

               <div {...stylex.props(styles.footer)}>
                  <BsPeopleFill {...stylex.props(styles.footerIcon)} />
                  <span {...stylex.props(styles.footerText)}>
                     Shared with <strong>followers you follow back</strong>
                  </span>
                  <IoChevronDownSharp {...stylex.props(styles.footerChevron)} />
               </div>

               {ownNote && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 12px' }}>
                     <button
                        type="button"
                        {...stylex.props(styles.deleteButton)}
                        onClick={handleDelete}
                        disabled={loading}
                     >
                        Delete note
                     </button>
                  </div>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
