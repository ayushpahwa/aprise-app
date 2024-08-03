package in.aprise.finance.account;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.account.model.AccountTypes;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class AccountRepositoryTest {

    @Autowired
    private AccountRepository repositoryUnderTest;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private CurrencyRepository currencyRepository;

    List<Account> mockAccountList = new ArrayList<Account>();
    User savedUser;
    Currency savedCurrency;

    @BeforeEach
    void setUp() {
        // prepare
        Currency currency = Currency.builder().name("USD").symbol("USD").build();
        savedCurrency = currencyRepository.save(currency);

        var user = User.builder().email("ayushpahwa96@gmail.com").hashPassword("encodedTestPass")
                .fullName("AP")
                .createdAt(LocalDateTime.now()).isVerified(false).build();
        savedUser = usersRepository.save(user);

        Account mockAccount1 = Account
                .builder()
                .user(savedUser)
                .currency(savedCurrency)
                .type(AccountTypes.SAVINGS_ACCOUNT)
                .name("AP cash")
                .created_at(LocalDateTime.now())
                .starting_balance(0)
                .current_balance(0)
                .build();
        Account savedMockAccount1 = repositoryUnderTest.save(mockAccount1);
        mockAccountList.add(savedMockAccount1);
    }

    @AfterEach
    void tearDown() {
        repositoryUnderTest.deleteAll();
        mockAccountList.clear();
    }

    @Test
    void itShouldReturnAccountsRelatedToUserId() {
        // act
        List<Account> foundAccounts = repositoryUnderTest.findAccountsByUserId(savedUser.getId());

        // assert
        assertEquals(mockAccountList,foundAccounts);
    }

    @Test
    void itShouldReturnEmptyForNoResultsFound() {
        // act: send a random ID other than the saved user ID
        List<Account> foundAccounts = repositoryUnderTest.findAccountsByUserId(savedUser.getId()+1L);

        // assert
        assertTrue(foundAccounts.isEmpty());
    }

    @Test
    void itShouldReturnMultipleAccountsForUserId() {
        // prepare: add one more account (other than the one added in setup)
        Account mockAccount2 = Account
                .builder()
                .user(savedUser)
                .currency(savedCurrency)
                .type(AccountTypes.CHECKING_ACCOUNT)
                .name("AP checking")
                .created_at(LocalDateTime.now())
                .starting_balance(0)
                .current_balance(0)
                .build();
        Account savedMockAccount2 = repositoryUnderTest.save(mockAccount2);
        mockAccountList.add(savedMockAccount2);

        // act
        List<Account> foundAccounts = repositoryUnderTest.findAccountsByUserId(savedUser.getId());

        // assert
        assertEquals(mockAccountList,foundAccounts);
    }

    @Test
    void itShouldReturnNoAccountsIfMarkedAsDeleted() {
        // prepare mark the created account as deleted
        Account mockAccount = mockAccountList.get(0);
        mockAccount.set_deleted(true);

        // act
        List<Account> foundAccounts = repositoryUnderTest.findAccountsByUserId(savedUser.getId());

        // assert
        assertTrue(foundAccounts.isEmpty());

    }
}