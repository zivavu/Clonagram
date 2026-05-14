'use client';

import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdLocationOn } from 'react-icons/md';
import Autocomplete from '@/src/components/Autocomplete';
import type { PostLocation } from '@/src/components/CreatePostModal/types';
import { styles } from './index.stylex';

const LOCATIONS: PostLocation[] = [
   { name: 'New York, NY', lat: 40.7128, lon: -74.006 },
   { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
   { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
   { name: 'Houston, TX', lat: 29.7604, lon: -95.3698 },
   { name: 'Miami, FL', lat: 25.7617, lon: -80.1918 },
   { name: 'Warsaw, Poland', lat: 52.2297, lon: 21.0122 },
   { name: 'Kraków, Poland', lat: 50.0647, lon: 19.945 },
   { name: 'Gniezno Rynek', lat: 52.535, lon: 17.5994 },
   { name: 'Gniezno', lat: 52.535, lon: 17.5994 },
   { name: 'Gniezno, Poland', lat: 52.535, lon: 17.5994 },
   { name: 'Gdańsk, Poland', lat: 54.352, lon: 18.6466 },
   { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278 },
   { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
   { name: 'Berlin, Germany', lat: 52.52, lon: 13.405 },
   { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
   { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
   { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832 },
   { name: 'Barcelona, Spain', lat: 41.3851, lon: 2.1734 },
   { name: 'Rome, Italy', lat: 41.9028, lon: 12.4964 },
   { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041 },
   { name: 'Vienna, Austria', lat: 48.2082, lon: 16.3738 },
   { name: 'Prague, Czech Republic', lat: 50.0755, lon: 14.4378 },
   { name: 'Budapest, Hungary', lat: 47.4979, lon: 19.0402 },
   { name: 'Stockholm, Sweden', lat: 59.3293, lon: 18.0686 },
   { name: 'Copenhagen, Denmark', lat: 55.6761, lon: 12.5683 },
   { name: 'Lisbon, Portugal', lat: 38.7223, lon: -9.1393 },
   { name: 'Athens, Greece', lat: 37.9838, lon: 23.7275 },
   { name: 'Zurich, Switzerland', lat: 47.3769, lon: 8.5417 },
];

interface LocationAutocompleteProps {
   value: PostLocation | null;
   onChange: (location: PostLocation | null) => void;
}

export default function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState('');

   const filtered = useMemo(() => {
      const q = query.toLowerCase();
      if (!q) return [];
      return LOCATIONS.filter(l => l.name.toLowerCase().includes(q)).slice(0, 8);
   }, [query]);

   const handleSelect = (location: PostLocation) => {
      onChange(location);
      setOpen(false);
      setQuery('');
   };

   const handleOpen = () => {
      setQuery(value?.name ?? '');
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
            renderItem={item => <span {...stylex.props(styles.locationItem)}>{item.name}</span>}
            keyExtractor={item => item.name}
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
            <span {...stylex.props(styles.label, styles.labelSelected)}>{value.name}</span>
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
