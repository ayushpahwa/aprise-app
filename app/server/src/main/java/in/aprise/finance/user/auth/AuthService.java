package in.aprise.finance.user.auth;

import in.aprise.finance.account.AccountService;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.GroupService;
import in.aprise.finance.shared.config.JWTService;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.dtos.AuthResponseDTO;
import in.aprise.finance.user.model.dtos.LoginRequestDTO;
import in.aprise.finance.user.model.dtos.RegisterRequestDTO;
import in.aprise.finance.user.model.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsersRepository usersRepository;
    private final CurrencyRepository currenciesRepository;
    private final AccountService accountService;
    private final JWTService jwtService;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final GroupService groupService;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Get currency from request
        var currency_id = request.getDefault_currency_id();
        var currency = currenciesRepository.findById(currency_id).orElseThrow(() -> new ApriseException(GlobalError.INVALID_CURRENCY));

        // Build user object
        var user = User.builder().email(request.getEmail()).hashPassword(encoder.encode(request.getPassword())).defaultCurrency(currency).fullName(request.getFullName()).createdAt(LocalDateTime.now()).isVerified(false).build();

        // Save user
        User savedUser;
        try {
            savedUser = usersRepository.save(user);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.USER_ALREADY_EXISTS);
        }

        // Create default account for user
        accountService.createAccount(savedUser, currency);

        // Create default group for user
        groupService.createDefaultGroupForUser(savedUser, currency);

        var token = jwtService.generateToken(user);
        return new AuthResponseDTO(token);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user;
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            user = usersRepository.findByEmail(request.getEmail()).orElseThrow();

        } catch (Exception e) {
            throw new ApriseException(GlobalError.AUTHENTICATION_ERROR);
        }

        var token = jwtService.generateToken(user);
        return new AuthResponseDTO(token);
    }
}
