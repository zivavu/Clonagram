'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { MdChevronLeft } from 'react-icons/md';
import z from 'zod';
import AuthPagesFooter from '@/src/components/AuthPagesFooter';
import BirthdatePicker from '@/src/components/BirthdatePicker';
import EmailSignupInput from '@/src/components/EmailSignupInput';
import LoginPageButton from '@/src/components/LoginPageButton';
import ZetaLogo from '@/src/components/ZetaLogo/ZetaLogo';
import { createClient } from '@/src/lib/supabase/client';
import { styles } from './index.stylex';

const birthdateSchema = z
   .object({
      month: z.number().int().min(1).max(12).nullable(),
      day: z.number().int().min(1).max(31).nullable(),
      year: z.number().int().nullable(),
   })
   .refine(v => v.month !== null && v.day !== null && v.year !== null, {
      message: 'Birthdate is required',
   });

const schema = z.object({
   email: z.email(),
   password: z.string().min(8),
   birthdate: birthdateSchema,
   fullName: z.string().min(1),
   username: z.string().min(1),
});

export type EmailSignupFormData = z.infer<typeof schema>;

export default function EmailSignUpPage() {
   const {
      register,
      handleSubmit,
      control,
      setError,
      formState: { errors },
   } = useForm<EmailSignupFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         birthdate: { month: null, day: null, year: null },
      },
   });

   const onSubmit = async (data: EmailSignupFormData) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
         email: data.email,
         password: data.password,
         options: {
            data: {
               full_name: data.fullName,
               username: data.username,
            },
         },
      });
      if (error) {
         setError('root', { message: error.message });
      }
   };

   return (
      <>
         <div {...stylex.props(styles.root)}>
            <Link href="/login" {...stylex.props(styles.backButton)}>
               <MdChevronLeft style={{ fontSize: 28 }} />
            </Link>
            <div {...stylex.props(styles.contentContainer)}>
               <ZetaLogo />
               <h1 {...stylex.props(styles.title)}>Get started on Clonagram</h1>
               <span {...stylex.props(styles.description)}>Sign up to see photos and videos from your friends.</span>
               <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>
                  <EmailSignupInput
                     label="Mobile number or email"
                     topLabel="Mobile number or email"
                     {...register('email')}
                  />
                  <span {...stylex.props(styles.learnMoreLinkContainer)}>
                     You may receive notifications from us.{' '}
                     <Link href="/" {...stylex.props(styles.accentLink)}>
                        Learn why we ask for your contact information
                     </Link>
                  </span>
                  <EmailSignupInput label="Password" topLabel="Password" {...register('password')} />
                  <Controller
                     control={control}
                     name="birthdate"
                     render={({ field }) => <BirthdatePicker value={field.value} onChange={field.onChange} />}
                  />
                  <EmailSignupInput label="Full Name" topLabel="Name" {...register('fullName')} />
                  <EmailSignupInput label="Username" topLabel="Username" {...register('username')} />

                  <div {...stylex.props(styles.policyText)}>
                     <span>
                        People who use our service may have uploaded your contact information to Instagram.{' '}
                        <Link href="/" {...stylex.props(styles.accentLink)}>
                           Learn more.
                        </Link>
                     </span>
                     <span {...stylex.props(styles.policyParagraph)}>
                        By tapping Submit, you agree to create an account and to Instagram&apos;s{' '}
                        <Link href="/" {...stylex.props(styles.accentLink)}>
                           Terms.
                        </Link>{' '}
                        Learn how we collect, use and share your data in our{' '}
                        <Link href="/" {...stylex.props(styles.accentLink)}>
                           Privacy Policy
                        </Link>{' '}
                        and how we use cookies and similar technology in our{' '}
                        <Link href="/" {...stylex.props(styles.accentLink)}>
                           Cookies Policy.
                        </Link>
                     </span>
                     <span {...stylex.props(styles.policyParagraph)}>
                        The{' '}
                        <Link href="/" {...stylex.props(styles.accentLink)}>
                           Privacy Policy
                        </Link>{' '}
                        describes the ways we can use the information we collect when you create an account. For
                        example, we use this information to provide, personalize and improve our products, including
                        ads.
                     </span>
                  </div>
                  {errors.root?.message && (
                     <span role="alert" style={{ color: 'rgb(237, 73, 86)', fontSize: 13, textAlign: 'center' }}>
                        {errors.root.message}
                     </span>
                  )}
                  <LoginPageButton variant="primary" text="Submit" type="submit" />

                  <LoginPageButton
                     variant="outlined"
                     text="I already have an account"
                     linkProps={{
                        href: '/passwordreset',
                        style: { marginTop: '16px', marginBottom: '16px' },
                     }}
                  />
               </form>
            </div>
         </div>
         <AuthPagesFooter style={{ minHeight: 'fit-content' }} />
      </>
   );
}
