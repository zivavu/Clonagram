import DirectMessagesPage from '@/src/pageComponents/DirectMessages';

interface DirectGeneralChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectGeneralChat({ params }: DirectGeneralChatPageProps) {
   const { chatId } = await params;
   return <DirectMessagesPage currentFolderHref="/direct/general" chatId={chatId} />;
}
