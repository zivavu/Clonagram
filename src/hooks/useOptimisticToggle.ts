import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/src/components/AppToast';
import { getErrorMessage } from '@/src/lib/unwrap';

type UseOptimisticToggleOptions<T> = {
   queryKey: readonly unknown[];
   mutationFn: () => Promise<unknown>;
   updater: (old: T) => T;
   extraInvalidations?: readonly unknown[][];
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
      onError: (err, _vars, context) => {
         if (context?.previous !== undefined) {
            queryClient.setQueryData(queryKey, context.previous);
         }
         toast(getErrorMessage(err));
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey });
         extraInvalidations?.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
         });
      },
   });
}
