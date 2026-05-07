import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { styles } from './index.stylex';

interface LoginPageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   text: string;
   borderColor?: 'primary' | 'gray';
   variant: 'transparent' | 'primary' | 'outlined';
   icon?: ReactNode;
   linkProps?: React.ComponentProps<typeof Link>;
}

export default function LoginPageButton({
   text,
   variant = 'transparent',
   icon,
   linkProps,
   ...props
}: LoginPageButtonProps) {
   if (linkProps) {
      const sx = stylex.props(styles.root, styles[variant]);
      return (
         <Link {...linkProps} {...sx} style={{ ...linkProps.style, ...sx.style }}>
            {icon}
            {text}
         </Link>
      );
   }
   return (
      <button {...stylex.props(styles.root, styles[variant])} {...props}>
         {icon}
         {text}
      </button>
   );
}
