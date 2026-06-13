import DirectMessagesPage from '@/src/pageComponents/DirectMessages';

interface DirectRequestsChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectRequestsChat({ params }: DirectRequestsChatPageProps) {
   const { chatId } = await params;
   return (
      <DirectMessagesPage currentFolderHref="/direct/requests" chatId={chatId} isRequestsPage />
   );
}
