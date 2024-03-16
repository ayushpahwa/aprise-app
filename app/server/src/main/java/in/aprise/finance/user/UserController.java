package in.aprise.finance.user;

import in.aprise.finance.shared.dtos.ResponseDTO;
import in.aprise.finance.user.model.dtos.UserProfileResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseDTO<UserProfileResponseDTO> profile() {
        return new ResponseDTO<>(HttpStatus.OK.value(), userService.profile(), "User profile fetched successfully");
    }
}
