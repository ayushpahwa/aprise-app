package in.aprise.finance.shared.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDTO implements Serializable {

    private String code;

    private String title;

    private String message;

    private String errorType;

    public ErrorDTO(String code, String message) {
        this.code = code;
        this.message = message;
    }
}

