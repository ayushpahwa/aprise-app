package in.aprise.finance.user.model.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "email can't be blank")
    @Email(message = "invalid format")
    private String email;
    @NotBlank(message = "password can't be blank")
    private String password;
    @NotBlank(message = "name can't be blank")
    private String fullName;
    @Range(min = 1, message = "default currency can not be empty")
    private int default_currency_id;
}
