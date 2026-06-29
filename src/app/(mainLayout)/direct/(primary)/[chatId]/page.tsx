import DirectChat from '@/src/pageComponents/DirectMessages/components/DirectChat';

interface DirectChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectChatPage({ params }: DirectChatPageProps) {
   const { chatId } = await params;
   return (
      <DirectChat
         chatId={chatId}
         folder="primary"
         currentFolderHref="/direct"
         emptyVariant="messages"
      />
   );
}
