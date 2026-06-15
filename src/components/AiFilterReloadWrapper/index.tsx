'use client';

import { useIsFetching } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAiFilterStore } from '@/src/store/useAiFilterStore';

interface AiFilterReloadWrapperProps {
   children: React.ReactNode;
   skeleton: React.ReactNode;
}

export default function AiFilterReloadWrapper({ children, skeleton }: AiFilterReloadWrapperProps) {
   const isReloading = useAiFilterStore(state => state.isReloading);
   const setReloading = useAiFilterStore(state => state.setReloading);
   const isFetching = useIsFetching();

   useEffect(() => {
      if (isReloading && isFetching === 0) {
         setReloading(false);
      }
   }, [isReloading, isFetching, setReloading]);

   if (isReloading) {
      return skeleton;
   }

   return children;
}
