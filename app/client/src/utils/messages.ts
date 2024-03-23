export function createMessage(format: (...strArgs: any[]) => string, ...args: any[]) {
  return format(...args);
}

export const AUTH_CONTENT_TITLE = (isLoginMode: boolean) => (isLoginMode ? 'Log in' : 'Sign up');
export const AUTH_CONTENT_SWITCH_MODE = (isLoginMode: boolean) => (isLoginMode ? 'Create a new user' : 'Log in instead');
