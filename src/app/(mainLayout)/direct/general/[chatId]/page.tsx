import DirectMessagesPage from '@/src/pageComponents/DirectMessages';
import type { DirectPageProps } from '../../[chatId]/page';

export default async function DirectGeneral({ params }: DirectPageProps) {
   const { chatId } = await params;
   return <DirectMessagesPage chatId={chatId} currentFolderHref="/direct/general" />;
}
