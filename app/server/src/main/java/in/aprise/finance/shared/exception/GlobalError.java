package in.aprise.finance.shared.exception;

import in.aprise.finance.shared.dtos.ErrorType;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.text.MessageFormat;

@Getter
@RequiredArgsConstructor
public enum GlobalError {

    INTERNAL_SERVER_ERROR(
            500,
            ErrorCode.INTERNAL_SERVER_ERROR.getCode(),
            "Internal server error while processing request",
            "Internal server error",
            ErrorType.INTERNAL_ERROR),
    AUTHENTICATION_ERROR(
            401,
            ErrorCode.AUTHENTICATION_ERROR.getCode(),
            "Authentication error while processing request",
            "Authentication error",
            ErrorType.AUTHENTICATION_ERROR),
    USER_ALREADY_EXISTS(
            400,
            "AE-APP-4001",
            "User already exists",
            "User already exists",
            ErrorType.BAD_REQUEST),
    INVALID_CURRENCY(
            400,
            "AE-APP-4002",
            "Invalid currency",
            "Given currency id is invalid",
            ErrorType.BAD_REQUEST),
    CREATE_USER_CURRENCY_FAILED(
            400,
            "AE-APP-4003",
            "Create user failed",
            "Create user currency failed",
            ErrorType.INTERNAL_ERROR),
    GENERIC_BAD_REQUEST(
            400,
            ErrorCode.GENERIC_BAD_REQUEST.getCode(),
            "Bad request: {0}",
            "Invalid request",
            ErrorType.BAD_REQUEST),
    GENERIC_RESOURCE_NOT_FOUND(
            404,
            ErrorCode.GENERIC_RESOURCE_NOT_FOUND.getCode(),
            "Resource not found: {0}",
            "Resource not found",
            ErrorType.BAD_REQUEST),
    ;

    private final Integer httpErrorCode;
    private final String appErrorCode;
    private final String message;
    private final String title;
    @NonNull
    private final ErrorType errorType;

    public String getMessage(Object... args) {
        return new MessageFormat(this.message).format(args);
    }
}
