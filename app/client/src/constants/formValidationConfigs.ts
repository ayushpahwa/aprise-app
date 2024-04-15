import {
  VALIDATION_AMOUNT_INVALID,
  VALIDATION_AMOUNT_REQUIRED,
  VALIDATION_DESC_REQUIRED,
  VALIDATION_EMAIL_INVALID,
  VALIDATION_EMAIL_REQUIRED,
  VALIDATION_FULLNAME_REQUIRED,
  VALIDATION_GROUP_NAME_REQUIRED,
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

export const txnAmountValidationConfig = {
  required: createMessage(VALIDATION_AMOUNT_REQUIRED),
  validate: {
    zeroCheck: (value: string) => {
      const parsedValue = parseFloat(value.slice(2));
      return parsedValue !== 0
        ? true
        : createMessage(VALIDATION_AMOUNT_REQUIRED);
    },
    trailingDotCheck: (value: string) => {
      return !value.endsWith(".")
        ? true
        : createMessage(VALIDATION_AMOUNT_INVALID);
    },
  },
};

export const groupSelectValidationConfig = {
  required: createMessage(VALIDATION_GROUP_NAME_REQUIRED),
};
