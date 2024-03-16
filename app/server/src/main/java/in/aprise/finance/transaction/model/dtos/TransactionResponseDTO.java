package in.aprise.finance.transaction.model.dtos;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.transaction.model.enums.TransactionSplitType;
import in.aprise.finance.transaction.model.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponseDTO {

        private long id;
        private String description;
        private float amount;
        private Currency currency;
        private TransactionType type;
        private TransactionSplitType splitType;
        private LocalDateTime createdAt;

        //optional
        private GroupMember createdBy;
}
