import DirectFolderLayout from '@/src/pageComponents/DirectMessages/components/DirectFolderLayout';

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
   return (
      <DirectFolderLayout folder="general" currentFolderHref="/direct/general">
         {children}
      </DirectFolderLayout>
   );
}
