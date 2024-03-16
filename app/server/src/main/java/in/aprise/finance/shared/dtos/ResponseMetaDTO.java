package in.aprise.finance.shared.dtos;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMetaDTO {

    private int status;

    private String message;

    private boolean success = true;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ErrorDTO error;

    public ResponseMetaDTO(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public ResponseMetaDTO(int status, ErrorDTO errorDTO) {
        this.status = status;
        this.error = errorDTO;
        this.message = errorDTO.getMessage();
        this.success = false;
    }
}
