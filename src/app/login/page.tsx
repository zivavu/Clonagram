import { Suspense } from 'react';
import LoginPage from '@/src/pageComponents/Login';

export const dynamic = 'force-static';

export default function Login() {
   return (
      <Suspense>
         <LoginPage />
      </Suspense>
   );
}
