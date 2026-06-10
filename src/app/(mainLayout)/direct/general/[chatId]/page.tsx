import { renderDirectPage } from '../../renderDirectPage';

interface DirectGeneralChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectGeneralChat({ params }: DirectGeneralChatPageProps) {
   const { chatId } = await params;
   return renderDirectPage({ currentFolderHref: '/direct/general', chatId });
}
