'use client';

import { DotLottieReact, setWasmUrl } from '@lottiefiles/dotlottie-react';

setWasmUrl('/dotlottie-player.wasm');

export default function StickerMessage({ src }: { src: string }) {
   return <DotLottieReact src={src} loop autoplay style={{ width: 160, height: 160 }} />;
}
