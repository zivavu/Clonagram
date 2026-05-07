'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import LoginPageButton from '@/src/components/LoginPageButton';
import ZetaLogo from '@/src/components/ZetaLogo/ZetaLogo';
import { createClient } from '@/src/lib/supabase/client';
import FloatingInput from '../../../components/FloatingInput';
import { colors } from '../../../styles/tokens.stylex';
import { styles } from './RightSection.stylex';

const schema = z.object({
   email: z.email(),
   password: z.string().min(8),
});

export default function RightSection() {
   const supabase = createClient();
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
      const { data, error } = await supabase.auth.signInWithPassword({
         email: formData.email,
         password: formData.password,
      });
      if (error) {
         setError('root', { message: error.message });
         return;
      }
      if (data.user?.confirmed_at === null) {
         setError('root', { message: 'Please confirm your email before logging in.' });
      } else {
         router.push('/');
      }
   }

   const googleIcon = <Image src="/icons/google.svg" alt="" aria-hidden width={20} height={20} />;

   async function signInWithGoogle() {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
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
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.titleContainer)}>Log into Clonagram</div>
          <form onSubmit={handleSubmit(signInUser)} style={{ display: 'contents' }}>
             <FloatingInput label="Mobile number, username or email" {...register('email')} autoComplete="off" />
             <FloatingInput label="Password" type="password" {...register('password')} autoComplete="current-password" />
            <LoginPageButton
               variant="primary"
               text="Log in"
               disabled={isSubmitting || !isValid}
               style={{ marginTop: '12px' }}
               type="submit"
            />
            {errors.root?.message && (
               <span role="alert" style={{ color: 'rgb(237, 73, 86)', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
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
      </div>
   );
}
