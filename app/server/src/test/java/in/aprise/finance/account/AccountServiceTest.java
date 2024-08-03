package in.aprise.finance.account;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.account.model.AccountTypes;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.user.UserTestHelpers;
import in.aprise.finance.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.lang.reflect.Field;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class AccountServiceTest {

    @MockBean
    AccountRepository accountRepository;
    private AccountService serviceUnderTest;

    @BeforeEach
    void setUp() {
        serviceUnderTest = new AccountService(accountRepository);
    }

    @Test
    void shouldThrowExceptionIfDBOperationFails() {
        // set mocks
        doThrow(new ApriseException(GlobalError.GENERIC_BAD_REQUEST))
                .when(accountRepository)
                .save(ArgumentMatchers.any(Account.class));

        // verify
        ApriseException thrown =  assertThrows(ApriseException.class, ()->{
            serviceUnderTest.createAccount(new User(),new Currency(), AccountTypes.SAVINGS_ACCOUNT);
        });
        assertTrue(thrown.getMessage().contains(GlobalError.GENERIC_BAD_REQUEST.getMessage()));
    }

    @Test
    void showSucceedIfDBOpSucceeds() {
        Currency currency = new Currency(1, "USD","USD");
        User user = UserTestHelpers.createDefaultUser(currency);
        Account expectedAccountObj = AccountTestHelpers.createDefaultAccount(user,currency);

        // when
        serviceUnderTest.createAccount(user, currency, AccountTypes.SAVINGS_ACCOUNT);

        // then
        ArgumentCaptor<Account> accountArgumentCaptor = ArgumentCaptor.forClass(Account.class);
        verify(accountRepository).save(accountArgumentCaptor.capture());

        Account captureValueAccount = accountArgumentCaptor.getValue();

        // We are matching each value separately since the `created_at` field was coming different (diff was in some 100 ms) and changing
        // the code to accommodate this did not make sense. Hence, we capture the params and compare the important fields
        for (Field field : Account.class.getDeclaredFields()) {
            field.setAccessible(true);
            if (!field.getName().equals("created_at")) {
                try {
                    assertEquals(field.get(expectedAccountObj), field.get(captureValueAccount),
                            "Field " + field.getName() + " did not match");
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    @Test
    void itShouldThrowExceptionIfUpdateFails() {
        Account account = AccountTestHelpers.createDefaultAccount();
        float amount = 1;

        // set mocks
        doThrow(new ApriseException(GlobalError.GENERIC_BAD_REQUEST))
                .when(accountRepository)
                .save(any(Account.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.updateBalance(account, amount);
        });

        // verify
        assertTrue(thrown.getMessage().contains(GlobalError.GENERIC_BAD_REQUEST.getMessage()));
    }

    @ParameterizedTest
    @ValueSource(floats = {1.0f, 2.5f, -1.5f, 0.0f})
    void itShouldSucceedIfUpdatePasses() {
        // given
        LocalDateTime creationTime = LocalDateTime.now();
        Account startingAccount = AccountTestHelpers.createDefaultAccount(creationTime);
        float amount = 1;

        // when
        serviceUnderTest.updateBalance(startingAccount,amount);

        // then: compare the value with a new object and set the current balance as amount (since starting balance was 0)
        Account expectedAccount = AccountTestHelpers.createDefaultAccount(amount, creationTime);
        verify(accountRepository).save(expectedAccount);

    }
}