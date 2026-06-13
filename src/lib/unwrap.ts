export function throwIfError(result: { error: { message: string } | null }, message: string) {
   if (result.error) {
      throw new Error(`${message}: ${result.error.message}`);
   }
}
