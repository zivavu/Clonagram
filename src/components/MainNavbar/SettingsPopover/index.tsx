'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { RiLoader4Line, RiMenuFill, RiRobot2Line } from 'react-icons/ri';
import { TbLogout, TbTrash } from 'react-icons/tb';
import { deleteAccount } from '@/src/actions/auth/deleteAccount';
import { toggleHideAiContent } from '@/src/actions/profile/toggleHideAiContent';
import { supabase } from '@/src/lib/supabase/client';
import { useSettingsPopoverStore } from '@/src/store/createModalStore';
import { useAiFilterStore } from '@/src/store/useAiFilterStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { colors } from '../../../styles/tokens.stylex';
import { toast } from '../../AppToast';
import DeleteConfirmModal from '../../DeleteConfirmModal';
import { styles as buttonStyles } from '../index.stylex';
import { styles } from './index.stylex';

interface SettingsPopoverButtonProps {
   hideAiContent: boolean;
   isAnonymous: boolean;
}

export function SettingsPopoverButton({ hideAiContent, isAnonymous }: SettingsPopoverButtonProps) {
   const { isOpen, toggle, close } = useSettingsPopoverStore();
   const { isDark, toggle: toggleTheme } = useThemeStore();
   const router = useRouter();
   const queryClient = useQueryClient();

   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [isDeletingAccount, setIsDeletingAccount] = useState(false);
   const [isTogglingHideAi, setIsTogglingHideAi] = useState(false);
   const [optimisticHideAi, setOptimisticHideAi] = useState(hideAiContent);
   const setAiFilterReloading = useAiFilterStore(state => state.setReloading);

   useEffect(() => {
      setOptimisticHideAi(hideAiContent);
   }, [hideAiContent]);

   async function handleToggleHideAi() {
      if (isTogglingHideAi) return;
      const next = !hideAiContent;
      setOptimisticHideAi(next);
      setIsTogglingHideAi(true);
      setAiFilterReloading(true);
      try {
         await toggleHideAiContent(next);
         queryClient.invalidateQueries();
      } catch (error) {
         setOptimisticHideAi(hideAiContent);
         setAiFilterReloading(false);
         toast(error instanceof Error ? error.message : 'Could not update setting. Try again.');
      } finally {
         setIsTogglingHideAi(false);
      }
   }

   async function handleLogout() {
      await supabase.auth.signOut();
      queryClient.clear();
      router.push('/login');
   }

   async function handleDeleteAccount() {
      setIsDeletingAccount(true);
      try {
         await deleteAccount();
         await supabase.auth.signOut();
         queryClient.clear();
         router.push('/login');
      } catch (error) {
         toast(error instanceof Error ? error.message : 'Could not delete account. Try again.');
      } finally {
         setIsDeletingAccount(false);
         setShowDeleteConfirm(false);
      }
   }

   return (
      <>
         <Popover open={isOpen} onOpenChange={toggle}>
            <PopoverTrigger asChild>
               <button aria-label="More" {...stylex.props(buttonStyles.navItem)}>
                  <RiMenuFill size={28} />
                  <span {...stylex.props(buttonStyles.navItemLabel)}>More</span>
               </button>
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={8} {...stylex.props(styles.root)}>
               <div {...stylex.props(styles.appearanceRow)}>
                  <span {...stylex.props(styles.appearanceLabel)}>
                     {isDark ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}
                     {isDark ? 'Dark mode' : 'Light mode'}
                  </span>
                  <button
                     type="button"
                     aria-label="Toggle appearance"
                     onClick={toggleTheme}
                     {...stylex.props(styles.toggle, isDark ? styles.toggleOn : styles.toggleOff)}
                  >
                     <span
                        {...stylex.props(
                           styles.toggleKnob,
                           isDark ? styles.toggleKnobOn : styles.toggleKnobOff,
                        )}
                     />
                  </button>
               </div>

               {!isAnonymous && (
                  <>
                     <div {...stylex.props(styles.separator)} />
                     <div {...stylex.props(styles.appearanceRow)}>
                        <span {...stylex.props(styles.appearanceLabel)}>
                           <RiRobot2Line size={18} />
                           Hide AI content
                        </span>
                        <button
                           type="button"
                           aria-label="Toggle AI content visibility"
                           disabled={isTogglingHideAi}
                           onClick={() => {
                              handleToggleHideAi();
                           }}
                           {...stylex.props(
                              styles.toggle,
                              optimisticHideAi ? styles.toggleOn : styles.toggleOff,
                           )}
                        >
                           {isTogglingHideAi ? (
                              <span {...stylex.props(styles.spinner)}>
                                 <RiLoader4Line size={14} color={colors.white} />
                              </span>
                           ) : (
                              <span
                                 {...stylex.props(
                                    styles.toggleKnob,
                                    optimisticHideAi ? styles.toggleKnobOn : styles.toggleKnobOff,
                                 )}
                              />
                           )}
                        </button>
                     </div>
                  </>
               )}

               <div {...stylex.props(styles.separator)} />

               <button
                  type="button"
                  onClick={() => {
                     handleLogout();
                     close();
                  }}
                  {...stylex.props(styles.item)}
               >
                  <TbLogout size={18} />
                  Log out
               </button>

               <div {...stylex.props(styles.separator)} />

               <button
                  type="button"
                  onClick={() => {
                     close();
                     setShowDeleteConfirm(true);
                  }}
                  {...stylex.props(styles.item, styles.itemDanger)}
               >
                  <TbTrash size={18} />
                  Delete account
               </button>
            </PopoverContent>
         </Popover>

         <DeleteConfirmModal
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            onConfirm={handleDeleteAccount}
            isLoading={isDeletingAccount}
            title="Delete account?"
            description="This will permanently delete your account and all your posts. This action cannot be undone."
            confirmLabel="Delete account"
         />
      </>
   );
}
