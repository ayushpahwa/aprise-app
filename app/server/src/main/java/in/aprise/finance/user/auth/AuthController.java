package in.aprise.finance.user.auth;

import in.aprise.finance.shared.dtos.ResponseDTO;
import in.aprise.finance.user.model.dtos.AuthResponseDTO;
import in.aprise.finance.user.model.dtos.LoginRequestDTO;
import in.aprise.finance.user.model.dtos.RegisterRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody @Valid RegisterRequestDTO request) {
        String message = "User registered successfully";
        HttpStatus status = HttpStatus.CREATED;
        AuthResponseDTO response = authService.register(request);
        ResponseDTO<AuthResponseDTO> formattedResponse = new ResponseDTO<>(status.value(), response, message);
        return ResponseEntity.status(status).body(formattedResponse);
    }

    @PostMapping("/login")
    public ResponseDTO<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        String message = "User logged in successfully";
        HttpStatus status = HttpStatus.OK;
        AuthResponseDTO response = authService.login(request);
        return new ResponseDTO<>(status.value(), response, message);
    }

}
