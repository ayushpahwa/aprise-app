package in.aprise.finance.user.auth;

import in.aprise.finance.account.AccountService;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.GroupService;
import in.aprise.finance.shared.config.JWTService;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import in.aprise.finance.user.model.dtos.AuthResponseDTO;
import in.aprise.finance.user.model.dtos.LoginRequestDTO;
import in.aprise.finance.user.model.dtos.RegisterRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class AuthServiceTest {

    // Repositories to mock
    @MockBean private UsersRepository usersRepository;
    @MockBean private CurrencyRepository currenciesRepository;
    @MockBean private AccountService accountService;
    @MockBean private JWTService jwtService;
    @MockBean private PasswordEncoder encoder;
    @MockBean private AuthenticationManager authenticationManager;
    @MockBean private GroupService groupService;

    private AuthService serviceUnderTest;

    @BeforeEach
    void setUp() {
        serviceUnderTest = new AuthService(usersRepository,currenciesRepository,accountService,jwtService,encoder,authenticationManager,groupService);
    }

    @Test
    void shouldFailRegisterIfCurrencyNotFound() {
        // given
        var email = "ayushpahwa96@gmail.com";
        var defaultCurrencyId = 1;
        RegisterRequestDTO requestDTO = new RegisterRequestDTO(email,"test123","AP",defaultCurrencyId);

        // Set mock
        when(currenciesRepository.findById(defaultCurrencyId)).thenThrow( new ApriseException(GlobalError.INVALID_CURRENCY));

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()->serviceUnderTest.register(requestDTO));

        // verify exception
        assertTrue(thrown.getMessage().contains(GlobalError.INVALID_CURRENCY.getMessage()));
    }

    @Test
    void shouldFailRegisterIfUserAlreadyExists() {
        // given
        var email = "ayushpahwa96@gmail.com";
        var defaultCurrencyId = 1;
        RegisterRequestDTO requestDTO = new RegisterRequestDTO(email,"test123","AP",defaultCurrencyId);

        // Set mock
        Currency currency = new Currency(defaultCurrencyId, "USD", "USD");
        when(currenciesRepository.findById(defaultCurrencyId)).thenReturn(Optional.of(currency));
        when(usersRepository.save(any(User.class))).thenThrow(new ApriseException(GlobalError.USER_ALREADY_EXISTS));

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()->serviceUnderTest.register(requestDTO));

        // verify exception
        assertTrue(thrown.getMessage().contains(GlobalError.USER_ALREADY_EXISTS.getMessage()));
    }

    @Test
    void shouldFailRegisterIfCreateAccountFailed() {
        // given
        var email = "ayushpahwa96@gmail.com";
        var defaultCurrencyId = 1;
        RegisterRequestDTO requestDTO = new RegisterRequestDTO(email,"test123","AP",defaultCurrencyId);

        // Set mock
        Currency currency = new Currency(defaultCurrencyId, "USD", "USD");
        User user = User.builder().email(email).hashPassword("hashedPassword").defaultCurrency(currency).fullName("AP").createdAt(LocalDateTime.now()).isVerified(false).build();
        when(currenciesRepository.findById(defaultCurrencyId)).thenReturn(Optional.of(currency));
        when(usersRepository.save(any(User.class))).thenReturn(user);
        doThrow(new ApriseException(GlobalError.GENERIC_BAD_REQUEST)).when(accountService).createAccount(any(User.class), any(Currency.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> serviceUnderTest.register(requestDTO));

        // verify exception
        assertTrue(thrown.getMessage().contains(GlobalError.GENERIC_BAD_REQUEST.getMessage()));
    }

    @Test
    void shouldFailRegisterIfCreateGroupFailed() {
        // given
        var email = "ayushpahwa96@gmail.com";
        var defaultCurrencyId = 1;
        RegisterRequestDTO requestDTO = new RegisterRequestDTO(email,"test123","AP",defaultCurrencyId);

        // Set mock
        Currency currency = new Currency(defaultCurrencyId, "USD", "USD");
        User user = User.builder().email(email).hashPassword("hashedPassword").defaultCurrency(currency).fullName("AP").createdAt(LocalDateTime.now()).isVerified(false).build();
        when(currenciesRepository.findById(defaultCurrencyId)).thenReturn(Optional.of(currency));
        when(usersRepository.save(any(User.class))).thenReturn(user);
        doThrow(new ApriseException(GlobalError.GENERIC_BAD_REQUEST)).when(groupService).createDefaultGroupForUser(any(User.class), any(Currency.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> serviceUnderTest.register(requestDTO));

        // verify exception
        assertTrue(thrown.getMessage().contains(GlobalError.GENERIC_BAD_REQUEST.getMessage()));
    }

    @Test
    void shouldSucceedRegisterForCorrectInput() {
        // given
        var email = "ayushpahwa96@gmail.com";
        var defaultCurrencyId = 1;
        RegisterRequestDTO requestDTO = new RegisterRequestDTO(email,"test123","AP",defaultCurrencyId);

        // Set mock
        when(currenciesRepository.findById(defaultCurrencyId)).thenReturn(Optional.of(new Currency()));
        when(usersRepository.save(any(User.class))).thenReturn(new User());

        var token = "test-token";
        when(jwtService.generateToken(any(User.class))).thenReturn(token);

        // when
        assertEquals(serviceUnderTest.register(requestDTO),new AuthResponseDTO(token));
        serviceUnderTest.register(requestDTO);
    }

    @Test
    void shouldFailLoginIfEmailNotFound() {
        // given
        var email = "ayushpahwa96@gmail.com";
        LoginRequestDTO requestDTO = new LoginRequestDTO(email,"test123");

        // set mock
        when(usersRepository.findByEmail(email)).thenReturn(Optional.empty());

        // when
        assertThrows(ApriseException.class, () -> {
            serviceUnderTest.login(requestDTO);
        });

        // then
        verify(usersRepository).findByEmail(email);
    }

    @Test
    void shouldFailLoginIfPasswordIsWrong() {
        // given
        var email = "ayushpahwa96@gmail.com";
        LoginRequestDTO requestDTO = new LoginRequestDTO(email,"test123");

        // set mock
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new BadCredentialsException("Bad credentials"));

        // when
        assertThrows(ApriseException.class, () -> {
            serviceUnderTest.login(requestDTO);
        });

    }

    @Test
    void shouldSucceedLoginIfEmailFound() {
        // given
        var email = "ayushpahwa96@gmail.com";
        LoginRequestDTO requestDTO = new LoginRequestDTO(email,"test123");

        // set mock
        User user = new User();
        user.setEmail(email);
        user.setHashPassword("test123");
        when(usersRepository.findByEmail(email)).thenReturn(Optional.of(user));

        var token = "test-token";
        when(jwtService.generateToken(user)).thenReturn(token);

        // when
        assertEquals(serviceUnderTest.login(requestDTO),new AuthResponseDTO( token));
        serviceUnderTest.login(requestDTO);
    }
}