'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import Autocomplete from '@/src/components/Autocomplete';
import { UserListItem } from '@/src/components/UserListItem';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { userProfilesQuery } from '@/src/queries/userProfiles';
import type { PartialUser } from '@/src/types/global';
import { styles } from './index.stylex';

interface UserAutocompleteProps {
   multiSelect?: boolean;
   selected?: PartialUser[];
   onSelect: (user: PartialUser) => void;
   onDone?: () => void;
   onDismiss?: () => void;
   placeholder?: string;
   header?: React.ReactNode;
   autoFocus?: boolean;
}

export default function UserAutocomplete({
   multiSelect = false,
   selected = [],
   onSelect,
   onDone,
   onDismiss,
   placeholder = 'Search...',
   header,
   autoFocus = true,
}: UserAutocompleteProps) {
   const [query, setQuery] = useState('');
   const { data: authUser } = useAuthUser();

   const { data: filtered = [] } = useQuery({
      queryKey: queryKeys.profileSearch(query, authUser?.id),
      queryFn: async () => {
         const { data, error } = await userProfilesQuery(supabase, {
            search: query,
            limit: 8,
            excludeId: authUser?.id,
            hideAi: authUser?.hide_ai_content ?? false,
         });
         if (error) throw error;
         return data;
      },
      enabled: !!query,
   });

   const isSelected = (user: PartialUser) => selected.some(s => s.id === user.id);

   return (
      <Autocomplete
         items={filtered}
         query={query}
         onQueryChange={setQuery}
         keyExtractor={u => u.id}
         onSelect={onSelect}
         placeholder={placeholder}
         autoFocus={autoFocus}
         onDismiss={onDismiss}
         header={header}
         renderItem={user => (
            <UserListItem
               avatarUrl={user.avatar_url}
               avatarAlt={user.username}
               username={user.username}
               name={user.username}
               fullName={user.full_name ?? ''}
               rightElement={
                  multiSelect ? (
                     <div
                        {...stylex.props(
                           styles.checkbox,
                           isSelected(user) && styles.checkboxChecked,
                        )}
                     >
                        {isSelected(user) && <IoCheckmark size={13} />}
                     </div>
                  ) : undefined
               }
            />
         )}
         rightAction={
            onDismiss ? (
               <button type="button" {...stylex.props(styles.dismissButton)} onClick={onDismiss}>
                  <IoClose size={18} />
               </button>
            ) : undefined
         }
         footer={
            multiSelect && onDone ? (
               <button type="button" {...stylex.props(styles.doneButton)} onClick={onDone}>
                  Done
               </button>
            ) : undefined
         }
      />
   );
}
