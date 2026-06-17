import { ActionError } from './actionError';

export function throwIfError(result: { error: { message: string } | null }, message: string) {
   if (result.error) {
      console.error(`${message}: ${result.error.message}`);
      throw new ActionError(`${message}: ${result.error.message}`);
   }
}
