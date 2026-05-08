import DirectMessagesPage from '@/src/pageComponents/DirectMessages';
import type { DirectPageProps } from '../../[chatId]/page';

export default async function DirectRequestsChat({ params }: DirectPageProps) {
   const { chatId } = await params;
   return <DirectMessagesPage chatId={chatId} currentFolderHref="/direct/requests" />;
}
