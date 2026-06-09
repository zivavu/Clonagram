import LoginPage from '@/src/pageComponents/Login';

export default function Login({
   searchParams,
}: {
   searchParams: Promise<{ reset?: string; error?: string }>;
}) {
   return <LoginPage searchParams={searchParams} />;
}
