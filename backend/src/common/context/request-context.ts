import { AsyncLocalStorage } from 'async_hooks';

export interface RequestPayload {
  userId: number;
  username: string;
  envScope: string;
}

export class RequestContext {
  private static readonly storage = new AsyncLocalStorage<RequestPayload>();

  static set(data: RequestPayload) {
    this.storage.enterWith(data);
  }

  static get(): RequestPayload | undefined {
    return this.storage.getStore();
  }

  static get currentEnv(): string {
    return this.get()?.envScope || 'PROD';
  }
}
