import DirectFolderLayout from '@/src/pageComponents/DirectMessages/components/DirectFolderLayout';

export default function RequestsLayout({ children }: { children: React.ReactNode }) {
   return (
      <DirectFolderLayout folder="requests" currentFolderHref="/direct/requests" isRequestsPage>
         {children}
      </DirectFolderLayout>
   );
}
