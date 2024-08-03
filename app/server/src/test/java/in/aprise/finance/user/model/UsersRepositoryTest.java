package in.aprise.finance.user.model;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UsersRepositoryTest {

    @Autowired
    private UsersRepository usersTest;

    @AfterEach
    void tearDown() {
        usersTest.deleteAll();
    }

    @Test
    void itShouldReturnUserIfEmailFound() {
        // prepare
        var email = "ayushpahwa96@gmail.com";
        var user = User.builder().email(email).hashPassword("encodedTestPass")
                .fullName("Ayush")
                .createdAt(LocalDateTime.now()).isVerified(false).build();
        usersTest.save(user);

        // act
        Optional<User> foundUser = usersTest.findByEmail(email);

        // assert
        assertEquals(foundUser.orElseThrow(),user);
    }

    @Test
    void itShouldThrowErrorIfEmailNotFound() {
        // prepare
        var email = "ayushpahwa96@gmail.com";
        var wrongEmail = "ayush@appsmith.com";
        var user = User.builder().email(email).hashPassword("encodedTestPass")
                .fullName("Ayush")
                .createdAt(LocalDateTime.now()).isVerified(false).build();
        usersTest.save(user);

        // act
        Optional<User> foundUser = usersTest.findByEmail(wrongEmail);

        // assert
        assert(foundUser.isEmpty());
    }
}