export class ActionError extends Error {
   constructor(message: string) {
      super(message);
      this.name = 'ActionError';
   }
}
