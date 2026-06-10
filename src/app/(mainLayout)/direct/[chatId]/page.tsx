import { renderDirectPage } from '../renderDirectPage';

interface DirectChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectChat({ params }: DirectChatPageProps) {
   const { chatId } = await params;
   return renderDirectPage({ currentFolderHref: '/direct', chatId });
}
