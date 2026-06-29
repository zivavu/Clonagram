import { ActionError } from './actionError';

export function throwIfError(result: { error: { message: string } | null }, message: string) {
   if (result.error) {
      throw new ActionError(`${message}: ${result.error.message}`);
   }
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong') {
   return err instanceof Error ? err.message : fallback;
}
