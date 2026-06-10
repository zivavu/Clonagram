import { renderDirectPage } from '../renderDirectPage';

export default function DirectRequests() {
   return renderDirectPage({ currentFolderHref: '/direct/requests', isRequestsPage: true });
}
