package in.aprise.finance.user;

import in.aprise.finance.account.AccountRepository;
import in.aprise.finance.account.model.Account;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.dtos.UserProfileResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class UserServiceTest {

    @MockBean
    AccountRepository accountRepository;

    private UserService serviceUnderTest;

    // vars
    long id = 1L;
    String email = "ayushpahwa96@gmail.com";
    String fullName = "AP";
    Currency defaultCurrency = new Currency(1, "USD", "USD");
    LocalDateTime joiningDate = LocalDateTime.now();
    User mockUser = UserTestHelpers.createDefaultUser(id, email, fullName, defaultCurrency, joiningDate);

    @BeforeEach
    void setUp() {
        serviceUnderTest = new UserService(accountRepository);

        // set authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void shouldReturnCorrectDataIfNoAccountsFound() {

        // setup mocks
        var mockedAccountList = new ArrayList<Account>();
        when(accountRepository.findAccountsByUserId(id)).thenReturn(mockedAccountList);

        // when
        UserProfileResponseDTO response = serviceUnderTest.profile();

        assertEquals(new UserProfileResponseDTO(id,fullName,email,defaultCurrency,mockedAccountList,joiningDate),response);
    }

    @Test
    void shouldReturnCorrectDataIfAccountsFound() {

        // setup mocks
        var mockedAccountList = new ArrayList<Account>();
        mockedAccountList.add(new Account());
        mockedAccountList.add(new Account());
        when(accountRepository.findAccountsByUserId(id)).thenReturn(mockedAccountList);

        // when
        UserProfileResponseDTO response = serviceUnderTest.profile();

        assertEquals(new UserProfileResponseDTO(id,fullName,email,defaultCurrency,mockedAccountList,joiningDate),response);
        assertEquals(2, response.accounts().size());
    }
}