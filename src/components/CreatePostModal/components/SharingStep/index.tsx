"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect } from "react";
import { shared } from "../Spinner.stylex";
import StepHeader from "../StepHeader";

const spin = stylex.keyframes({
   from: { transform: "rotate(0deg)" },
   to: { transform: "rotate(360deg)" },
});

const styles = stylex.create({
   spinningRing: {
      animationName: spin,
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
   },
});

interface SharingStepProps {
   onDone: () => void;
}

export default function SharingStep({ onDone }: SharingStepProps) {
   useEffect(() => {
      const timer = setTimeout(onDone, 3000);
      return () => clearTimeout(timer);
   }, [onDone]);

   return (
      <div {...stylex.props(shared.root)}>
         <StepHeader title="Sharing" />
         <div {...stylex.props(shared.body)}>
            <div {...stylex.props(shared.ring, styles.spinningRing)}>
               <div {...stylex.props(shared.ringInner)} />
            </div>
         </div>
      </div>
   );
}
