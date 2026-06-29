import DirectFolderLayout from '@/src/pageComponents/DirectMessages/components/DirectFolderLayout';

export default function PrimaryLayout({ children }: { children: React.ReactNode }) {
   return (
      <DirectFolderLayout folder="primary" currentFolderHref="/direct">
         {children}
      </DirectFolderLayout>
   );
}
