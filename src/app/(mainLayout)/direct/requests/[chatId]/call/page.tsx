import CallPage from '@/src/pageComponents/Call';
import { loadCallData } from '@/src/pageComponents/Call/loadCallData';

interface CallPageRouteProps {
   params: Promise<{ chatId: string }>;
   searchParams: Promise<{ type?: string }>;
}

export default async function RequestsCallPage({ params, searchParams }: CallPageRouteProps) {
   const { chatId } = await params;
   const { type } = await searchParams;
   const callType = type === 'video' ? 'video' : 'audio';
   const data = await loadCallData(chatId);

   return (
      <CallPage
         conversationId={chatId}
         backHref={`/direct/requests/${chatId}`}
         callType={callType}
         {...data}
      />
   );
}
