'use client';

import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import Autocomplete from '@/src/components/Autocomplete';
import { UserListItem } from '@/src/components/shared/UserListItem';
import { SUGGESTED_USERS } from '@/src/mocks/users';
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

   const filtered = useMemo(() => {
      const q = query.toLowerCase();
      const all = q
         ? SUGGESTED_USERS.filter(
              u =>
                 u.username.toLowerCase().includes(q) ||
                 (u.full_name?.toLowerCase().includes(q) ?? false),
           )
         : SUGGESTED_USERS;
      return all.slice(0, 8);
   }, [query]);

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
               name={user.username}
               subtitle={user.full_name ?? ''}
               rightElement={
                  multiSelect ? (
                     <div
                        {...stylex.props(
                           styles.checkbox,
                           isSelected(user) && styles.checkboxChecked,
                        )}
                     >
                        {isSelected(user) && <IoCheckmark style={{ fontSize: 13 }} />}
                     </div>
                  ) : undefined
               }
            />
         )}
         rightAction={
            onDismiss ? (
               <button type="button" {...stylex.props(styles.dismissButton)} onClick={onDismiss}>
                  <IoClose style={{ fontSize: 18 }} />
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
