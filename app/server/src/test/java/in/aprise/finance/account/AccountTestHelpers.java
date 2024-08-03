package in.aprise.finance.account;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.account.model.AccountTypes;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.user.model.User;

import java.time.LocalDateTime;

public class AccountTestHelpers {

    public static Account createDefaultAccount() {
        return Account.builder()
                .user(new User())
                .currency(new Currency())
                .type(AccountTypes.SAVINGS_ACCOUNT)
                .name("AP cash")
                .created_at(LocalDateTime.now())
                .starting_balance(0)
                .current_balance(0)
                .build();
    }

    public static Account createDefaultAccount(User user, Currency currency) {
        Account account = createDefaultAccount();
        account.setUser(user);
        account.setCurrency(currency);
        account.setName(user.getFullName() + "'s " + AccountTypes.SAVINGS_ACCOUNT + " account");
        return account;
    }

    public static Account createDefaultAccount(LocalDateTime creationTime) {
        Account account = createDefaultAccount();
        account.setCreated_at(creationTime);
        return account;
    }

    public static Account createDefaultAccount(float currentBalance, LocalDateTime creationTime) {
        Account account = createDefaultAccount();
        account.setCreated_at(creationTime);
        account.setCurrent_balance(currentBalance);
        return account;
    }
}
