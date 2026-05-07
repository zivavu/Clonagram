import DirectMessagesPage from '@/src/pageComponents/DirectMessages';

export interface DirectPageProps {
   params: Promise<{ chatId: string | undefined }>;
}

export default async function DirectGeneral({ params }: DirectPageProps) {
   const { chatId } = await params;
   return <DirectMessagesPage chatId={chatId} currentFolderHref="/direct" />;
}
