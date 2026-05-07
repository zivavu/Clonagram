export function isRequestsFolder(pathname: string): boolean {
   return pathname === '/direct/requests' || pathname.startsWith('/direct/requests/');
}
