'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdLocationOn } from 'react-icons/md';
import Autocomplete from '@/src/components/Autocomplete';
import type { PostLocation } from '@/src/components/CreatePostModal/types';
import { queryKeys } from '@/src/lib/queryKeys';
import { styles } from './index.stylex';

interface PhotonFeature {
   geometry: { coordinates: [number, number] };
   properties: {
      name?: string;
      city?: string;
      country?: string;
   };
}

function formatLocationName(props: PhotonFeature['properties']): string {
   const parts = [props.name, props.city, props.country].filter(Boolean) as string[];
   return [...new Set(parts)].join(', ');
}

async function searchLocations(query: string): Promise<PostLocation[]> {
   const url = new URL('https://photon.komoot.io/api/');
   url.searchParams.set('q', query);
   url.searchParams.set('limit', '8');
   url.searchParams.set('lang', 'en');
   const res = await fetch(url.toString());
   if (!res.ok) throw new Error('Location search failed');
   const json = (await res.json()) as { features: PhotonFeature[] };
   const seen = new Set<string>();
   return json.features.reduce<PostLocation[]>((acc, f) => {
      const name = formatLocationName(f.properties);
      if (!name || seen.has(name)) return acc;
      seen.add(name);
      acc.push({ lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], name });
      return acc;
   }, []);
}

interface LocationAutocompleteProps {
   value: PostLocation | null;
   onChange: (location: PostLocation | null) => void;
}

export default function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState('');
   const [debouncedQuery, setDebouncedQuery] = useState('');

   useEffect(() => {
      const timer = setTimeout(() => setDebouncedQuery(query), 350);
      return () => clearTimeout(timer);
   }, [query]);

   const { data: locations = [] } = useQuery({
      queryKey: queryKeys.locationSearch(debouncedQuery),
      queryFn: () => searchLocations(debouncedQuery),
      enabled: !!debouncedQuery,
   });

   const handleSelect = (location: PostLocation) => {
      onChange(location);
      setOpen(false);
      setQuery('');
      setDebouncedQuery('');
   };

   const handleOpen = () => {
      setQuery(value?.name ?? '');
      setOpen(true);
   };

   const handleClear = () => {
      onChange(null);
      setQuery('');
      setDebouncedQuery('');
      setOpen(false);
   };

   if (open) {
      return (
         <Autocomplete
            items={locations}
            query={query}
            onQueryChange={setQuery}
            renderItem={item => <span {...stylex.props(styles.locationItem)}>{item.name}</span>}
            keyExtractor={item => `${item.lat},${item.lon}`}
            onSelect={handleSelect}
            placeholder="Search locations..."
            autoFocus
            onDismiss={() => setOpen(false)}
            rightAction={
               <button type="button" {...stylex.props(styles.iconButton)} onClick={handleClear}>
                  <IoClose size={18} />
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
               <IoClose size={18} />
            </button>
         </div>
      );
   }

   return (
      <button type="button" {...stylex.props(styles.row)} onClick={handleOpen}>
         <span {...stylex.props(styles.label, styles.labelPlaceholder)}>Add location</span>
         <MdLocationOn size={20} style={{ opacity: 0.6 }} />
      </button>
   );
}
