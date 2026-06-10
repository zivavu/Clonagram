import DirectMessagesPage from '@/src/pageComponents/DirectMessages';

export function renderDirectPage({
   currentFolderHref,
   chatId,
   isRequestsPage,
}: {
   currentFolderHref: string;
   chatId?: string;
   isRequestsPage?: boolean;
}) {
   return (
      <DirectMessagesPage
         chatId={chatId}
         isRequestsPage={isRequestsPage}
         currentFolderHref={currentFolderHref}
      />
   );
}
