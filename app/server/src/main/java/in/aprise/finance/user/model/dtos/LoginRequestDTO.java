package in.aprise.finance.user.model.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "email can't be blank")
    @Email(message = "invalid format for email")
    private String email;
    @NotBlank(message = "password can't be blank")
    private String password;
}
