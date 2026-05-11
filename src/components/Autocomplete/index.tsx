'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import { styles } from './index.stylex';

export interface AutocompleteProps<T> {
   items: T[];
   query: string;
   onQueryChange: (query: string) => void;
   renderItem: (item: T) => React.ReactNode;
   keyExtractor: (item: T) => string;
   onSelect: (item: T) => void;
   placeholder?: string;
   header?: React.ReactNode;
   footer?: React.ReactNode;
   rightAction?: React.ReactNode;
   onDismiss?: () => void;
   autoFocus?: boolean;
}

export default function Autocomplete<T>({
   items,
   query,
   onQueryChange,
   renderItem,
   keyExtractor,
   onSelect,
   placeholder,
   header,
   footer,
   rightAction,
   autoFocus,
}: AutocompleteProps<T>) {
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (autoFocus) inputRef.current?.focus();
   }, [autoFocus]);

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.inputRow)}>
            {header && <div {...stylex.props(styles.header)}>{header}</div>}
            <input
               ref={inputRef}
               value={query}
               onChange={e => onQueryChange(e.target.value)}
               placeholder={placeholder}
               {...stylex.props(styles.input)}
            />
            {rightAction && <div {...stylex.props(styles.rightAction)}>{rightAction}</div>}
         </div>
         {items.length > 0 && (
            <ul {...stylex.props(styles.list)}>
               {items.map(item => (
                  // biome-ignore lint/a11y/noStaticElementInteractions: There might be a button in it's children, has to be a div
                  <div
                     key={keyExtractor(item)}
                     {...stylex.props(styles.listItem)}
                     onClick={() => onSelect(item)}
                     onKeyDown={e => {
                        if (e.key === 'Enter') onSelect(item);
                     }}
                  >
                     {renderItem(item)}
                  </div>
               ))}
            </ul>
         )}
         {footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
      </div>
   );
}
