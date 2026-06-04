'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function StickerMessage({ src }: { src: string }) {
   return <DotLottieReact src={src} loop autoplay style={{ width: 160, height: 160 }} />;
}
