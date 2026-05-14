import * as stylex from "@stylexjs/stylex";
import { colors } from "../../../../styles/tokens.stylex";
import { shared } from "../Spinner.stylex";
import StepHeader, { StepHeaderAction } from "../StepHeader";

const slideOff = stylex.keyframes({
   from: { transform: "translateX(0%)" },
   to: { transform: "translateX(100%)" },
});

const styles = stylex.create({
   message: {
      fontSize: "16px",
      fontWeight: 600,
      color: colors.textPrimary,
      margin: 0,
   },
   checkmarkContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "56px",
      height: "56px",
      overflow: "hidden",
   },
   checkmarkOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "100%",
      backgroundColor: colors.bgBubble,
      animationName: slideOff,
      animationDuration: "0.4s",
      animationTimingFunction: "ease-out",
      animationFillMode: "forwards",
   },
});

interface PostSharedStepProps {
   onDone: () => void;
}

export default function PostSharedStep({ onDone }: PostSharedStepProps) {
   return (
      <div {...stylex.props(shared.root)}>
         <StepHeader title="Post shared" rightSlot={<StepHeaderAction label="Done" onClick={onDone} />} />
         <div {...stylex.props(shared.body)}>
            <div {...stylex.props(shared.ring)}>
               <div {...stylex.props(shared.ringInner)}>
                  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                     <defs>
                        <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                           <stop offset="0%" stopColor="rgb(131, 58, 180)" />
                           <stop offset="45%" stopColor="rgb(188, 24, 136)" />
                           <stop offset="70%" stopColor="rgb(240, 148, 51)" />
                           <stop offset="100%" stopColor="rgb(255, 200, 100)" />
                        </linearGradient>
                     </defs>
                  </svg>
                  <div {...stylex.props(styles.checkmarkContainer)}>
                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path
                           d="M20 6L9 17L4 12"
                           stroke="url(#checkmarkGradient)"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                     <div {...stylex.props(styles.checkmarkOverlay)} />
                  </div>
               </div>
            </div>
            <p {...stylex.props(styles.message)}>Your post has been shared.</p>
         </div>
      </div>
   );
}
