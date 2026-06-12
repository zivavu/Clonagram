export function throwIfError(result: { error: { message: string } | null }, message: string): void {
   if (result.error) {
      throw new Error(`${message}: ${result.error.message}`);
   }
}
