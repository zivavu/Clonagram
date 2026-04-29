import { DESKTOP_GAP, DESKTOP_SIDE_H, DESKTOP_SIDE_W, MOBILE_BP } from './constants';
import type { Layout } from './types';

export function computeLayout(index: number): Layout {
   const vw = window.innerWidth;
   const vh = window.innerHeight;

   if (vw < MOBILE_BP) {
      const mainW = vw;
      const mainH = Math.round((mainW * 16) / 9);
      return {
         mainWidth: mainW,
         mainHeight: mainH,
         sideWidth: mainW,
         sideHeight: mainH,
         gap: 0,
         xOffset: -index * mainW,
         isMobile: true,
      };
   }

   const mainH = Math.round(vh * 0.94);
   const mainW = Math.round((mainH * 9) / 16);
   return {
      mainWidth: mainW,
      mainHeight: mainH,
      sideWidth: DESKTOP_SIDE_W,
      sideHeight: DESKTOP_SIDE_H,
      gap: DESKTOP_GAP,
      xOffset: vw / 2 - index * (DESKTOP_SIDE_W + DESKTOP_GAP) - mainW / 2,
      isMobile: false,
   };
}

export function formatTimestamp(timestamp: string): string {
   const date = new Date(timestamp);
   if (Number.isNaN(date.getTime())) return '';

   const diff = Date.now() - date.getTime();
   const MINUTE = 60_000;
   const units: [number, string][] = [
      [365 * 24 * 60 * MINUTE, 'y'],
      [30 * 24 * 60 * MINUTE, 'mo'],
      [7 * 24 * 60 * MINUTE, 'w'],
      [24 * 60 * MINUTE, 'd'],
      [60 * MINUTE, 'h'],
      [MINUTE, 'm'],
   ];

   for (const [ms, label] of units) {
      if (diff >= ms) return `${Math.floor(diff / ms)}${label}`;
   }

   return 'just now';
}
