'use client';

import { useEffect, useRef } from 'react';

export function useObjectUrls() {
   const urlsRef = useRef<string[]>([]);

   useEffect(() => {
      const urls = urlsRef.current;
      return () => {
         for (const url of urls) URL.revokeObjectURL(url);
      };
   }, []);

   return function createObjectUrl(blob: Blob) {
      const url = URL.createObjectURL(blob);
      urlsRef.current.push(url);
      return url;
   };
}
