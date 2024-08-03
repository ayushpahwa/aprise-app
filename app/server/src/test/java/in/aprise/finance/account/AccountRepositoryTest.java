package in.aprise.finance.account;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.user.UserTestHelpers;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

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

    List<Account> mockAccountList = new ArrayList<>();
    User savedUser;
    Currency savedCurrency;

    @BeforeEach
    void setUp() {
        // prepare
        Currency currency = Currency.builder().name("USD").symbol("USD").build();
        savedCurrency = currencyRepository.save(currency);

        var user = UserTestHelpers.createDefaultUser(currency);
        savedUser = usersRepository.save(user);

        Account mockAccount1 = AccountTestHelpers.createDefaultAccount(savedUser, savedCurrency);
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
        Account mockAccount2 = AccountTestHelpers.createDefaultAccount(savedUser,savedCurrency);
        Account savedMockAccount2 = repositoryUnderTest.save(mockAccount2);
        mockAccountList.add(savedMockAccount2);

        // act
        List<Account> foundAccounts = repositoryUnderTest.findAccountsByUserId(savedUser.getId());

        // assert
        assertEquals(mockAccountList,foundAccounts);
    }

    // Return correct data if entry with user id is found which is not marked as deleted
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