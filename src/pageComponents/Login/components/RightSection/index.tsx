'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
   const [isLoading, setIsLoading] = useState(false);

   const supabase = createBrowserClient();
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
      setIsLoading(true);
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
         setError('root', { message: error.message });
         return;
      }

      setIsLoading(false);
      window.location.href = '/';
   }

   const GoogleIcon = (
      <Image src="/icons/google.svg" alt="Google login" aria-hidden width={20} height={20} />
   );

   const AnonymousLoginIcon = (
      <Image src="/icons/anonymous.svg" alt="Anonymous login" aria-hidden width={22} height={22} />
   );

   async function signInWithGoogle() {
      const origin =
         process.env.NEXT_PUBLIC_APP_URL ??
         (typeof window !== 'undefined' ? window.location.origin : '');
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

   const disableButtons = isSubmitting || isLoading;

   return (
      <main {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.titleContainer)}>Log into Clonagram</div>
         <form onSubmit={handleSubmit(signInUser)} style={{ display: 'contents' }}>
            <FloatingInput label="Email adress" {...register('email')} autoComplete="email" />
            <FloatingInput
               label="Password"
               type="password"
               {...register('password')}
               autoComplete="current-password"
            />
            <LoginPageButton
               disabled={disableButtons || !isValid}
               variant="primary"
               text="Log in"
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
            disabled={disableButtons}
            variant="outlined"
            text="Log in with Google"
            icon={GoogleIcon}
            onClick={signInWithGoogle}
            style={{ marginTop: '42px' }}
         />
         <LoginPageButton
            variant="outlined"
            text="Anonymous login"
            onClick={signInAnonymously}
            disabled={disableButtons}
            icon={AnonymousLoginIcon}
         />
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
