import DirectMessagesPage from '@/src/pageComponents/DirectMessages';

interface DirectChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectChat({ params }: DirectChatPageProps) {
   const { chatId } = await params;
   return <DirectMessagesPage currentFolderHref="/direct" chatId={chatId} />;
}
