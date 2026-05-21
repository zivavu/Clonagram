'use client';

import { useAuthUser } from '../../hooks/useAuthUser';

export default function Username() {
   const { data: user } = useAuthUser();

   return <span>{user?.username}</span>;
}
