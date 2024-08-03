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
        return account;
    }
}
