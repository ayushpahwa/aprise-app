package in.aprise.finance.transaction;

import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.transaction.model.enums.TransactionSplitType;
import in.aprise.finance.transaction.model.enums.TransactionType;

import java.time.LocalDateTime;

public class TransactionTestHelpers {

    public static Transaction createDefaultTxn() {
        return Transaction.builder()
                .amount(100)
                .type(TransactionType.EXPENSE)
                .splitType(TransactionSplitType.EQUAL)
                .description("My transaction")
                .created_at(LocalDateTime.now())
                .build();
    }
}
