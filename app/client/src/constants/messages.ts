export function createMessage(format: (...strArgs: any[]) => string, ...args: any[]) {
  return format(...args);
}

export const ERROR_401 = () => `We are unable to verify your identity. Please login again.`;
export const ERROR_413 = (maxFileSize: number) => `Payload too large. File size cannot exceed ${maxFileSize}MB.`;
export const ERROR_403 = (entity: string, userEmail: string) =>
  `Sorry, but your account (${userEmail}) does not seem to have the required access to update this ${entity}. Please get in touch with your aprise admin to resolve this.`;
export const ERROR_500 = () => `We apologize, something went wrong. We're trying to fix things.`;
export const SERVER_API_TIMEOUT_ERROR = () => `Aprise server is taking too long to respond. Please try again after some time`;

export const AUTH_CONTENT_TITLE = (isLoginMode?: boolean) => (!!isLoginMode ? 'Log in' : 'Tell us about yourself');
export const AUTH_CONTENT_SWITCH_MODE = (isLoginMode?: boolean) => (!!isLoginMode ? 'Create a new user' : 'Log in instead');
export const AUTH_FORM_EMAIL_LABEL = () => 'Email Address';
export const AUTH_FORM_CONFIRM_EMAIL_LABEL = () => 'Confirm Email Address';
export const AUTH_FORM_PASSWORD_LABEL = () => 'Password';
export const AUTH_FORM_CONFIRM_PASSWORD_LABEL = () => 'Confirm Password';
export const AUTH_FORM_LOGIN_CTA_LABEL = () => 'Log in';
export const AUTH_FORM_SIGNUP_CTA_LABEL = () => 'Sign up';
export const AUTH_FORM_FULLNAME_LABEL = () => 'Full Name';
export const AUTH_FORM_DEFAULT_CURRENCY_LABEL = () => 'Preferred Currency';
export const AUTH_ALERT_LOGIN_ERROR_TITLE = () => 'Login Error';
export const AUTH_ALERT_LOGIN_ERROR_MESSAGE = () => 'Invalid credentials, please check your credentials and try again.';
export const AUTH_ALERT_REGISTER_ERROR_MESSAGE = () => 'Something went wrong, please check your details and try again.';

// Validation error messages
export const VALIDATION_EMAIL_REQUIRED = () => 'Email is required';
export const VALIDATION_EMAIL_INVALID = () => 'Invalid email address';
export const VALIDATION_PASSWORD_REQUIRED = () => 'Password is required';
export const VALIDATION_PASSWORD_MIN_LENGTH = () => 'Password must be at least 6 characters long';
export const VALIDATION_PASSWORDS_MUST_MATCH = () => 'Passwords must match';
export const VALIDATION_EMAILS_MUST_MATCH = () => 'Email addresses must match';
export const VALIDATION_INVALID_INPUT = () => 'Please check your entered credentials';
export const VALIDATION_FULLNAME_REQUIRED = () => 'Name is required';
