import { useMutation, useQueryClient } from '@tanstack/react-query';

type UseOptimisticToggleOptions<T> = {
   queryKey: unknown[];
   mutationFn: () => Promise<unknown>;
   updater: (old: T) => T;
   extraInvalidations?: unknown[][];
};

export function useOptimisticToggle<T>({
   queryKey,
   mutationFn,
   updater,
   extraInvalidations,
}: UseOptimisticToggleOptions<T>) {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn,
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey });
         const previous = queryClient.getQueryData<T>(queryKey);
         queryClient.setQueryData<T>(queryKey, old => (old === undefined ? old : updater(old)));
         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous !== undefined) {
            queryClient.setQueryData(queryKey, context.previous);
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey });
         extraInvalidations?.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
         });
      },
   });
}
