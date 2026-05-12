import { colors } from '../../styles/tokens.stylex';

export default function EmailSignupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div style={{ width: '100%', backgroundColor: colors.bgElevated }} data-auth-font>
         {children}
      </div>
   );
}
