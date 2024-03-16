package in.aprise.finance.user.model.dtos;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.currency.Currency;

import java.time.LocalDateTime;
import java.util.List;

public record UserProfileResponseDTO(
        long id,
        String fullName,
        String email,
        Currency defaultCurrency,
        List<Account> accounts,
        LocalDateTime joiningDate
) {
}
