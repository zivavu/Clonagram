import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

interface LoginPageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   text: string;
   borderColor?: 'primary' | 'gray';
   variant: 'transparent' | 'primary' | 'outlined';
   icon?: ReactNode;
   linkProps?: React.ComponentProps<typeof Link>;
}

const styles = stylex.create({
   root: {
      height: '44px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      borderRadius: radius.xl,
      fontWeight: 500,
      fontSize: '15px',
      cursor: 'pointer',
      ':disabled': {
         cursor: 'not-allowed',
      },
   },
   transparent: {
      backgroundColor: 'transparent',
      border: 'none',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   primary: {
      backgroundColor: colors.accent,
      fontSize: '15px',
      ':disabled': {
         color: colors.textSecondary,
         opacity: 0.6,
      },
      ':hover': {
         backgroundColor: colors.accentHover,
      },
   },
   outlined: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
      borderWidth: '1px',
      borderStyle: 'solid',
      color: colors.textPrimary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
});

export default function LoginPageButton({
   text,
   variant = 'transparent',
   icon,
   linkProps,
   ...props
}: LoginPageButtonProps) {
   if (linkProps) {
      return (
         <Link {...linkProps} {...stylex.props(styles.root, styles[variant])}>
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
