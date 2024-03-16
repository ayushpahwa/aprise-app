package in.aprise.finance.group.model.dtos;

import in.aprise.finance.transaction.model.dtos.TransactionMembersRequestDTO;
import in.aprise.finance.transaction.model.enums.TransactionSplitType;
import in.aprise.finance.transaction.model.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateTransactionDTO {

    @Range(min = 1, message = "Currency is mandatory")
    private int currency_id;
    private float amount;
    private TransactionType type;
    private TransactionSplitType split_type;
    private long category_id;
    private String description;
    @NotNull(message = "Transaction members are mandatory")
    private TransactionMembersRequestDTO members;
}
