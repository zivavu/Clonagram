'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import LoginPageButton from '@/src/components/LoginPageButton';
import { supabase } from '@/src/lib/supabase/client';
import FloatingInput from '../../../../components/FloatingInput';
import { styles } from './index.stylex';

const resetSchema = z
   .object({
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
   })
   .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
   });

interface ResetPasswordProps {
   onBack: () => void;
}

export default function ResetPassword({ onBack }: ResetPasswordProps) {
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
      <>
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
         <LoginPageButton variant="transparent" text="Back to login" onClick={onBack} />
      </>
   );
}
