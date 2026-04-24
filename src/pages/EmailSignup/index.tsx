'use client';

import AuthPagesFooter from '@/src/components/AuthPagesFooter/Footer';
import BirthdatePicker from '@/src/components/BirthdatePicker';
import EmailSignupInput from '@/src/components/EmailSignupInput';
import LoginPageButton from '@/src/components/LoginPageButton';
import ZetaLogo from '@/src/components/ZetaLogo/ZetaLogo';
import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { colors, radius } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto',
      padding: '32px 28px',
      display: 'flex',
      flexDirection: 'column',
   },
   backButton: {
      borderRadius: radius.full,
      padding: '8px',
      display: 'flex',
      width: 'fit-content',
      color: colors.textSecondary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
   },
   title: {
      fontSize: '1.5rem',
      fontWeight: '450',
      color: colors.textPrimary,
      marginTop: '16px',
   },
   description: {
      fontSize: '0.9375rem',
      fontWeight: '400',
      marginTop: '4px',
   },
   learnMoreLinkContainer: {
      fontSize: '0.9375rem',
      fontWeight: '400',
      marginTop: '12px',
   },
   policyText: {
      fontSize: '0.9375rem',
      fontWeight: '300',
      lineHeight: '1.2667',
      marginTop: '16px',
      marginBottom: '24px',
   },
   policyParagraph: {
      display: 'block',
      marginTop: '8px',
   },
   accentLink: {
      color: colors.accentText,
      ':hover': {
         color: colors.accentTextHover,
         textDecoration: 'underline',
      },
   },
   topLabel: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: colors.textPrimary,
   },
});

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
   const { register, handleSubmit, control } = useForm<EmailSignupFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         birthdate: { month: null, day: null, year: null },
      },
   });

   const onSubmit = (data: EmailSignupFormData) => {
      console.log(data);
   };

   return (
      <>
         <div {...stylex.props(styles.root)}>
            <Link href="/login" {...stylex.props(styles.backButton)}>
               <ChevronLeft strokeWidth={1.75} size={28} />
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
