import { renderDirectPage } from '../../renderDirectPage';

interface DirectRequestsChatPageProps {
   params: Promise<{ chatId: string }>;
}

export default async function DirectRequestsChat({ params }: DirectRequestsChatPageProps) {
   const { chatId } = await params;
   return renderDirectPage({
      currentFolderHref: '/direct/requests',
      chatId,
      isRequestsPage: true,
   });
}
