package in.aprise.finance.account;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.account.model.AccountTypes;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.user.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    @Transactional
    public void createAccount(User user, Currency currency, AccountTypes accountType) {
        Account account = Account
                .builder()
                .user(user)
                .currency(currency)
                .type(accountType)
                .name(user.getFullName() + "'s " + accountType.toString() + " account")
                .created_at(LocalDateTime.now())
                .starting_balance(0)
                .current_balance(0)
                .build();
        try {
            accountRepository.save(account);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, e.getMessage());
        }
    }

    public void createAccount(User user, Currency currency) {
        createAccount(user, currency, AccountTypes.CASH);
    }

    public void updateBalance(Account account, float amount) {
        account.setCurrent_balance(account.getCurrent_balance() + amount);
        try {
            accountRepository.save(account);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, e.getMessage());
        }
    }
}
