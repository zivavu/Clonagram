'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import LoginPageButton from '@/src/components/LoginPageButton';
import ZetaLogo from '@/src/components/ZetaLogo';
import { createBrowserClient } from '@/src/lib/supabase/client';
import FloatingInput from '../../../../components/FloatingInput';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

const schema = z.object({
   email: z.email(),
   password: z.string().min(8),
});

export default function RightSection() {
   const supabase = createBrowserClient();
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      setError,
   } = useForm({
      resolver: zodResolver(schema),
   });

   async function signInUser(formData: z.infer<typeof schema>) {
      const { error } = await supabase.auth.signInWithPassword({
         email: formData.email,
         password: formData.password,
      });

      if (error) {
         setError('root', { message: error.message });
         return;
      }

      window.location.href = '/';
   }

   async function signInAnonymously() {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
         console.error(error);
         setError('root', { message: error.message });
         return;
      }

      window.location.href = '/';
   }

   const googleIcon = <Image src="/icons/google.svg" alt="" aria-hidden width={20} height={20} />;

   async function signInWithGoogle() {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');
      const { error } = await supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
            redirectTo: `${origin}/auth/callback`,
         },
      });
      if (error) {
         setError('root', { message: error.message });
      }
   }

   return (
      <main {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.titleContainer)}>Log into Clonagram</div>
         <form onSubmit={handleSubmit(signInUser)} style={{ display: 'contents' }}>
            <FloatingInput label="Email adress" {...register('email')} autoComplete="email" />
            <FloatingInput label="Password" type="password" {...register('password')} autoComplete="current-password" />
            <LoginPageButton
               variant="primary"
               text="Log in"
               disabled={isSubmitting || !isValid}
               style={{ marginTop: '12px' }}
               type="submit"
            />
            {errors.root?.message && (
               <span role="alert" {...stylex.props(styles.errorAlert)}>
                  {errors.root.message}
               </span>
            )}
         </form>
         <LoginPageButton variant="transparent" text="Forgot password?" />
         <LoginPageButton
            variant="outlined"
            text="Log in with Google"
            icon={googleIcon}
            onClick={signInWithGoogle}
            style={{ marginTop: '42px' }}
         />
         <LoginPageButton variant="outlined" text="Anonymous login" onClick={signInAnonymously} />
         <LoginPageButton
            variant="outlined"
            text="Create new account"
            style={{ borderColor: colors.accent, color: colors.accent }}
            linkProps={{ href: '/emailsignup' }}
         />
         <ZetaLogo rootProps={{ style: { marginTop: '8px' } }} />
         <span {...stylex.props(styles.reportContent)}>
            You can also{' '}
            <Link href="/" {...stylex.props(styles.reportContentLink)}>
               report content you believe is unlawful
            </Link>{' '}
            in your country without logging in.
         </span>
      </main>
   );
}
