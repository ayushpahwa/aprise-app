package in.aprise.finance.account;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

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
    void createAccount() {
        // Prepare

    }

    @Test
    void updateBalance() {
    }
}