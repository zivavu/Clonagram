import CallPage from '@/src/pageComponents/Call';
import { loadCallData } from '@/src/pageComponents/Call/loadCallData';

interface CallPageRouteProps {
   params: Promise<{ chatId: string }>;
   searchParams: Promise<{ type?: string; join?: string }>;
}

export default async function GeneralCallPage({ params, searchParams }: CallPageRouteProps) {
   const { chatId } = await params;
   const { type, join } = await searchParams;
   const callType = type === 'video' ? 'video' : 'audio';
   const data = await loadCallData(chatId);

   return (
      <CallPage
         conversationId={chatId}
         backHref={`/direct/general/${chatId}`}
         callType={callType}
         autoJoin={join === 'true'}
         {...data}
      />
   );
}
