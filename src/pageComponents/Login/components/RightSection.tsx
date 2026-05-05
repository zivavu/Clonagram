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

const GoogleIcon = <Image src="/icons/google.svg" alt="" aria-hidden width={20} height={20} />;

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
      formState: { isSubmitting, isValid },
   } = useForm({
      resolver: zodResolver(schema),
   });

   async function singInUser(formData: z.infer<typeof schema>) {
      const { data, error } = await supabase.auth.signInWithPassword({
         email: formData.email,
         password: formData.password,
      });
      if (error) {
         console.error(error);
      }
      if (data) {
         console.log(data);
         if (data.user?.confirmed_at === null) {
            console.log('User is not confirmed');
         } else router.push('/');
      }
   }

   async function signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
            redirectTo: `${window.location.origin}/auth/callback`,
         },
      });
      if (error) {
         console.error(error);
      }
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.titleContainer)}>Log into Clonagram</div>
         <form onSubmit={handleSubmit(singInUser)} style={{ display: 'contents' }}>
            <FloatingInput label="Mobile number, username or email" {...register('email')} autoComplete="off" />
            <FloatingInput label="Password" type="password" {...register('password')} autoComplete="new-password" />
            <LoginPageButton
               variant="primary"
               text="Log in"
               disabled={isSubmitting || !isValid}
               style={{ marginTop: '12px' }}
               type="submit"
            />
         </form>
         <LoginPageButton variant="transparent" text="Forgot password?" />
         <LoginPageButton
            variant="outlined"
            text="Log in with Google"
            icon={GoogleIcon}
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
