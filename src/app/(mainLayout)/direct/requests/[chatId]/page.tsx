import DirectChat from '@/src/pageComponents/DirectMessages/components/DirectChat';

interface DirectRequestsChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectRequestsChatPage({ params }: DirectRequestsChatPageProps) {
   const { chatId } = await params;
   return (
      <DirectChat
         chatId={chatId}
         folder="requests"
         currentFolderHref="/direct/requests"
         emptyVariant="requests"
      />
   );
}
