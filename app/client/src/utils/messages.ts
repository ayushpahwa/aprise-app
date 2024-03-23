export function createMessage(format: (...strArgs: any[]) => string, ...args: any[]) {
  return format(...args);
}

export const AUTH_CONTENT_TITLE = (isLoginMode?: boolean) => (!!isLoginMode ? 'Log in' : 'Sign up');
export const AUTH_CONTENT_SWITCH_MODE = (isLoginMode?: boolean) => (!!isLoginMode ? 'Create a new user' : 'Log in instead');
export const AUTH_FORM_EMAIL_LABEL = () => 'Email Address';
export const AUTH_FORM_CONFIRM_EMAIL_LABEL = () => 'Confirm Email Address';
export const AUTH_FORM_PASSWORD_LABEL = () => 'Password';
export const AUTH_FORM_CONFIRM_PASSWORD_LABEL = () => 'Confirm Password';
export const AUTH_FORM_LOGIN_CTA_LABEL = () => 'Log in';
export const AUTH_FORM_SIGNUP_CTA_LABEL = () => 'Sign up';

// Validation error messages
export const VALIDATION_EMAIL_REQUIRED = () => 'Email is required';
export const VALIDATION_EMAIL_INVALID = () => 'Invalid email address';
export const VALIDATION_PASSWORD_REQUIRED = () => 'Password is required';
export const VALIDATION_PASSWORD_MIN_LENGTH = () => 'Password must be at least 6 characters long';
export const VALIDATION_PASSWORDS_MUST_MATCH = () => 'Passwords must match';
export const VALIDATION_EMAILS_MUST_MATCH = () => 'Email addresses must match';
export const VALIDATION_INVALID_INPUT = () => 'Please check your entered credentials';
