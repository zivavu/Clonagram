import { type ReactNode, Suspense } from 'react';
import DirectShell from '../DirectShell';
import RecipientsSidebar from '../RecipientsSidebar';
import SidebarSkeleton from '../SidebarSkeleton';

interface DirectFolderLayoutProps {
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
   isRequestsPage?: boolean;
   children: ReactNode;
}

export default function DirectFolderLayout({
   folder,
   currentFolderHref,
   isRequestsPage = false,
   children,
}: DirectFolderLayoutProps) {
   return (
      <DirectShell
         sidebar={
            <Suspense fallback={<SidebarSkeleton />}>
               <RecipientsSidebar
                  folder={folder}
                  currentFolderHref={currentFolderHref}
                  isRequestsPage={isRequestsPage}
               />
            </Suspense>
         }
      >
         {children}
      </DirectShell>
   );
}
