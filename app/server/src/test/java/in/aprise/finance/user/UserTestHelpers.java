package in.aprise.finance.user;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.user.model.User;

import java.time.LocalDateTime;

public class UserTestHelpers {

    public static User createDefaultUser() {
        return User.builder()
                .hashPassword("encodedTestPass")
                .email("ayushpahwa96@gmail.com")
                .fullName("Ayush Pahwa")
                .defaultCurrency(new Currency(1,"USD","USD"))
                .createdAt(LocalDateTime.now())
                .isVerified(false)
                .build();
    }

    public static User createDefaultUser (long id, String email, String fullName, Currency defaultCurrency, LocalDateTime joiningDate) {
        var user = createDefaultUser();
        user.setId(id);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setDefaultCurrency(defaultCurrency);
        user.setCreatedAt(joiningDate);
        return user;
    }

    public static User createDefaultUser (Currency defaultCurrency) {
        var user = createDefaultUser();
        user.setDefaultCurrency(defaultCurrency);
        return user;
    }

    public static User createDefaultUser(String email, Currency defaultCurrency) {
        var user = createDefaultUser();
        user.setEmail(email);
        user.setDefaultCurrency(defaultCurrency);
        return user;
    }
}
