package in.aprise.finance.shared.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    INTERNAL_SERVER_ERROR("AE-APP-5000", "Internal server error"),
    AUTHENTICATION_ERROR("AE-APP-5001", "Authentication error"),
    GENERIC_BAD_REQUEST("AE-BAD-4000", "Generic bad request"),
    GENERIC_RESOURCE_NOT_FOUND("AE-APP-4040", "Generic resource not found"),
    ;

    private final String code;
    private final String description;
}
