package in.aprise.finance.shared.exception;

import in.aprise.finance.shared.dtos.ErrorDTO;
import in.aprise.finance.shared.dtos.ResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private void doLog(Throwable error) {
        log.error("", error);

        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        error.printStackTrace(printWriter);

        // TODO: add sentry logging
    }

    @ExceptionHandler
    @ResponseBody
    public ResponseEntity<Object> catchApriseException(ApriseException e) {
        doLog(e);
        ResponseDTO<ErrorDTO> responseDTO = new ResponseDTO<>(e.getHttpStatus(), new ErrorDTO(e.getAppErrorCode(), e.getErrorType(), e.getMessage(), e.getTitle()));

        return ResponseEntity.status(e.getHttpStatus()).body(responseDTO);
    }

    @ExceptionHandler
    @ResponseBody
    public ResponseEntity<Object> catchGenericException(Exception e) {
        GlobalError error = GlobalError.INTERNAL_SERVER_ERROR;
        doLog(e);

        ResponseDTO<ErrorDTO> responseDTO = new ResponseDTO<>(error.getHttpErrorCode(), new ErrorDTO(error.getAppErrorCode(), error.getErrorType().toString(), error.getMessage(), error.getTitle()));

        return ResponseEntity.status(error.getHttpErrorCode()).body(responseDTO);
    }


    @ExceptionHandler
    @ResponseBody
    public ResponseEntity<Object> catchServerWebInputException(MethodArgumentNotValidException e) {
        GlobalError appsmithError = GlobalError.GENERIC_BAD_REQUEST;
        doLog(e);
        List<String> errors = new ArrayList<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            errors.add(error.getDefaultMessage());
        });

        ResponseDTO<ErrorDTO> response = new ResponseDTO<>(appsmithError.getHttpErrorCode(), new ErrorDTO(appsmithError.getAppErrorCode(), appsmithError.getErrorType().toString(), appsmithError.getMessage(errors), appsmithError.getTitle()));

        return ResponseEntity.status(appsmithError.getHttpErrorCode()).body(response);
    }

    @ExceptionHandler
    @ResponseBody
    public ResponseEntity<Object> catchServerWebInputException(HttpMessageNotReadableException e) {
        GlobalError appsmithError = GlobalError.GENERIC_BAD_REQUEST;
        doLog(e);
        List<String> errors = new ArrayList<>();
        errors.add(e.getMessage());

        ResponseDTO<ErrorDTO> response = new ResponseDTO<>(appsmithError.getHttpErrorCode(), new ErrorDTO(appsmithError.getAppErrorCode(), appsmithError.getErrorType().toString(), appsmithError.getMessage(errors), appsmithError.getTitle()));

        return ResponseEntity.status(appsmithError.getHttpErrorCode()).body(response);
    }
}
