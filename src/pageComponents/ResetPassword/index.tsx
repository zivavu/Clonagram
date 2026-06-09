'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import LoginPageButton from '@/src/components/LoginPageButton';
import ZetaLogo from '@/src/components/ZetaLogo';
import { supabase } from '@/src/lib/supabase/client';
import FloatingInput from '../../components/FloatingInput';
import { colors } from '../../styles/tokens.stylex';
import { styles } from '../Login/components/RightSection/index.stylex';

const resetSchema = z
   .object({
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
   })
   .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
   });

export default function ResetPasswordPage() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const [resetComplete, setResetComplete] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      setError,
   } = useForm({
      resolver: zodResolver(resetSchema),
   });

   async function onSubmit(formData: z.infer<typeof resetSchema>) {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
         password: formData.password,
      });
      if (error) {
         setError('root', { message: error.message });
      } else {
         setResetComplete(true);
      }
      setIsLoading(false);
   }

   return (
      <div {...stylex.props(pageStyles.root)}>
         <div {...stylex.props(pageStyles.card)}>
            <div {...stylex.props(styles.titleContainer)}>Create new password</div>
            {resetComplete ? (
               <span {...stylex.props(styles.successAlert)}>
                  Your password has been updated. You can now log in.
               </span>
            ) : (
               <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>
                  <FloatingInput
                     label="New password"
                     type="password"
                     {...register('password')}
                     autoComplete="new-password"
                  />
                  <FloatingInput
                     label="Confirm password"
                     type="password"
                     {...register('confirmPassword')}
                     autoComplete="new-password"
                  />
                  <LoginPageButton
                     disabled={isSubmitting || isLoading || !isValid}
                     variant="primary"
                     text="Reset password"
                     style={{ marginTop: '12px' }}
                     type="submit"
                  />
                  {errors.password?.message && (
                     <span role="alert" {...stylex.props(styles.errorAlert)}>
                        {errors.password.message}
                     </span>
                  )}
                  {errors.confirmPassword?.message && (
                     <span role="alert" {...stylex.props(styles.errorAlert)}>
                        {errors.confirmPassword.message}
                     </span>
                  )}
                  {errors.root?.message && (
                     <span role="alert" {...stylex.props(styles.errorAlert)}>
                        {errors.root.message}
                     </span>
                  )}
               </form>
            )}
            <LoginPageButton
               variant="transparent"
               text="Go to home"
               onClick={() => router.push('/')}
            />
            <ZetaLogo rootProps={{ style: { marginTop: '8px' } }} />
         </div>
      </div>
   );
}

const pageStyles = stylex.create({
   root: {
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: colors.bg,
   },
   card: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
      backgroundColor: colors.bgElevated,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
   },
});
