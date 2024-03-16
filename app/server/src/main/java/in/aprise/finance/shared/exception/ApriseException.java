package in.aprise.finance.shared.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApriseException extends BaseException {

    private final GlobalError error;
    private final transient Object[] args;

    public ApriseException(GlobalError error, Object... args) {
        super(error.getMessage(args));
        this.error = error;
        this.args = args;
    }

    public Integer getHttpStatus() {
        return this.error == null ? 500 : this.error.getHttpErrorCode();
    }

    @Override
    public String getMessage() {
        return this.error == null ? super.getMessage() : this.error.getMessage(this.args);
    }

    @Override
    public String getDownstreamErrorMessage() {
        // Downstream error message is not available for ApriseError
        return null;
    }

    @Override
    public String getDownstreamErrorCode() {
        // Downstream error code is not available for ApriseError
        return null;
    }

    public String getAppErrorCode() {
        return this.error.getAppErrorCode();
    }

    @Override
    public String getTitle() {
        return this.error.getTitle();
    }

    @Override
    public String getErrorType() {
        return this.error.getErrorType().toString();
    }

}
