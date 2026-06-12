'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { sendPasswordResetEmail } from '@/src/actions/auth/sendPasswordResetEmail';
import FloatingInput from '@/src/components/FloatingInput';
import LoginPageButton from '@/src/components/LoginPageButton';
import { styles } from './index.stylex';

const forgotSchema = z.object({
   email: z.email(),
});

interface ForgotPasswordProps {
   onBack: () => void;
   initialError?: string;
}

export default function ForgotPassword({ onBack, initialError }: ForgotPasswordProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [resetSent, setResetSent] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
      setError,
      clearErrors,
   } = useForm({
      resolver: zodResolver(forgotSchema),
   });

   async function onSubmit(formData: z.infer<typeof forgotSchema>) {
      setIsLoading(true);
      clearErrors();
      try {
         await sendPasswordResetEmail(formData.email);
         setResetSent(true);
      } catch (e) {
         setError('root', { message: e instanceof Error ? e.message : 'Something went wrong' });
      }
      setIsLoading(false);
   }

   return (
      <>
         <div {...stylex.props(styles.titleContainer)}>Reset your password</div>
         {resetSent ? (
            <span {...stylex.props(styles.successAlert)}>Check your email for a reset link.</span>
         ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>
               <FloatingInput label="Email address" {...register('email')} autoComplete="email" />
               <LoginPageButton
                  disabled={isSubmitting || isLoading || !isValid}
                  variant="primary"
                  text="Send reset link"
                  style={{ marginTop: '12px' }}
                  type="submit"
               />
               {errors.email?.message && (
                  <span role="alert" {...stylex.props(styles.errorAlert)}>
                     {errors.email.message}
                  </span>
               )}
               {errors.root?.message && (
                  <span role="alert" {...stylex.props(styles.errorAlert)}>
                     {errors.root.message}
                  </span>
               )}
               {initialError && (
                  <span role="alert" {...stylex.props(styles.errorAlert)}>
                     {initialError}
                  </span>
               )}
            </form>
         )}
         <LoginPageButton variant="transparent" text="Back to login" onClick={onBack} />
      </>
   );
}
