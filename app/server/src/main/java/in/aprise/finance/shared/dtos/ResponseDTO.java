package in.aprise.finance.shared.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 8965011907233699993L;

    private ResponseMetaDTO responseMeta;

    private T data;

    // DTO to handle response structure for success scenarios
    public ResponseDTO(int status, T data, String message) {
        this.responseMeta = new ResponseMetaDTO(status, message);
        this.data = data;
    }

    // DTO to handle response structure for error scenarios
    public ResponseDTO(int status, ErrorDTO errorDTO) {
        this.responseMeta = new ResponseMetaDTO(status, errorDTO);
    }
}

