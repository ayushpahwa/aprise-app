package in.aprise.finance.user;

import in.aprise.finance.account.AccountRepository;
import in.aprise.finance.account.model.Account;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.dtos.UserProfileResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final CurrencyRepository currencyRepository;
    private final AccountRepository accountRepository;

    public UserProfileResponseDTO profile() {
        // get user token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User validatedUser = (User) authentication.getPrincipal();

        // get currencies from user
        Currency defaultCurrency = validatedUser.getDefaultCurrency();

        // get accounts from user
         List<Account> accounts = accountRepository.findAccountsByUserId(validatedUser.getId());

        // get user from database
        return new UserProfileResponseDTO(
                validatedUser.getId(),
                validatedUser.getEmail(),
                validatedUser.getFullName(),
                defaultCurrency,
                accounts,
                validatedUser.getCreatedAt()
        );

    }
}
