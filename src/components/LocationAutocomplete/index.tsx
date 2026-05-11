'use client';

import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdLocationOn } from 'react-icons/md';
import Autocomplete from '@/src/components/Autocomplete';
import { styles } from './index.stylex';

const LOCATIONS = [
   'New York, NY',
   'Los Angeles, CA',
   'Chicago, IL',
   'Houston, TX',
   'Miami, FL',
   'Warsaw, Poland',
   'Kraków, Poland',
   'Gniezno Rynek',
   'Gniezno',
   'Gniezno, Poland',
   'Gdańsk, Poland',
   'London, United Kingdom',
   'Paris, France',
   'Berlin, Germany',
   'Tokyo, Japan',
   'Sydney, Australia',
   'Toronto, Canada',
   'Barcelona, Spain',
   'Rome, Italy',
   'Amsterdam, Netherlands',
   'Vienna, Austria',
   'Prague, Czech Republic',
   'Budapest, Hungary',
   'Stockholm, Sweden',
   'Copenhagen, Denmark',
   'Lisbon, Portugal',
   'Athens, Greece',
   'Zurich, Switzerland',
];

interface LocationAutocompleteProps {
   value: string | null;
   onChange: (location: string | null) => void;
}

export default function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState('');

   const filtered = useMemo(() => {
      const q = query.toLowerCase();
      if (!q) return [];
      return LOCATIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 8);
   }, [query]);

   const handleSelect = (location: string) => {
      onChange(location);
      setOpen(false);
      setQuery('');
   };

   const handleOpen = () => {
      setQuery(value ?? '');
      setOpen(true);
   };

   const handleClear = () => {
      onChange(null);
      setQuery('');
      setOpen(false);
   };

   if (open) {
      return (
         <Autocomplete
            items={filtered}
            query={query}
            onQueryChange={setQuery}
            renderItem={item => <span {...stylex.props(styles.locationItem)}>{item}</span>}
            keyExtractor={item => item}
            onSelect={handleSelect}
            placeholder="Search locations..."
            autoFocus
            onDismiss={() => setOpen(false)}
            rightAction={
               <button type="button" {...stylex.props(styles.iconButton)} onClick={handleClear}>
                  <IoClose style={{ fontSize: 18 }} />
               </button>
            }
         />
      );
   }

   if (value) {
      return (
         <div {...stylex.props(styles.row)}>
            <span {...stylex.props(styles.label, styles.labelSelected)}>{value}</span>
            <button type="button" {...stylex.props(styles.iconButton)} onClick={handleClear}>
               <IoClose style={{ fontSize: 18 }} />
            </button>
         </div>
      );
   }

   return (
      <button type="button" {...stylex.props(styles.row)} onClick={handleOpen}>
         <span {...stylex.props(styles.label, styles.labelPlaceholder)}>Add location</span>
         <MdLocationOn style={{ fontSize: 20, opacity: 0.6 }} />
      </button>
   );
}
