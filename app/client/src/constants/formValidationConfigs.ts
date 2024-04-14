import {
  VALIDATION_DESC_REQUIRED,
  VALIDATION_EMAIL_INVALID,
  VALIDATION_EMAIL_REQUIRED,
  VALIDATION_FULLNAME_REQUIRED,
  VALIDATION_PASSWORD_MIN_LENGTH,
  VALIDATION_PASSWORD_REQUIRED,
  createMessage,
} from "./messages";

export const emailValidationConfig = {
  required: createMessage(VALIDATION_EMAIL_REQUIRED),
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: createMessage(VALIDATION_EMAIL_INVALID),
  },
};

export const passwordValidationConfig = {
  required: createMessage(VALIDATION_PASSWORD_REQUIRED),
  minLength: {
    value: 6,
    message: createMessage(VALIDATION_PASSWORD_MIN_LENGTH),
  },
};

export const nameValidationConfig = {
  required: createMessage(VALIDATION_FULLNAME_REQUIRED),
};

export const descValidationConfig = {
  required: createMessage(VALIDATION_DESC_REQUIRED),
};
