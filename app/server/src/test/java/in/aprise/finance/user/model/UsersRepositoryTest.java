package in.aprise.finance.user.model;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.user.UserTestHelpers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class UsersRepositoryTest {

    @Autowired
    private UsersRepository repositoryUnderTest;

    @Autowired
    private CurrencyRepository currencyRepository;

    Currency savedCurrency;

    @BeforeEach
    void setUp() {
        Currency currency = Currency.builder().name("USD").symbol("USD").build();
        savedCurrency = currencyRepository.save(currency);
    }

    @AfterEach
    void tearDown() {
        repositoryUnderTest.deleteAll();
    }

    @Test
    void itShouldReturnUserIfEmailFound() {
        // prepare
        var email = "ayushpahwa96@gmail.com";
        var user = UserTestHelpers.createDefaultUser(email,savedCurrency);
        repositoryUnderTest.save(user);

        // act
        Optional<User> foundUser = repositoryUnderTest.findByEmail(email);

        // assert
        assertEquals(foundUser.orElseThrow(),user);
    }

    @Test
    void itShouldThrowErrorIfEmailNotFound() {
        // prepare
        var email = "ayushpahwa96@gmail.com";
        var wrongEmail = "ayushpahwa69@gmail.com";
        var user = UserTestHelpers.createDefaultUser(email,savedCurrency);
        repositoryUnderTest.save(user);

        // act
        Optional<User> foundUser = repositoryUnderTest.findByEmail(wrongEmail);

        // assert
        assert(foundUser.isEmpty());
    }
}