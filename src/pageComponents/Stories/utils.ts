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
