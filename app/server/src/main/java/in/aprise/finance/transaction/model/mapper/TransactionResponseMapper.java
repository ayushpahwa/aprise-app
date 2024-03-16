package in.aprise.finance.transaction.model.mapper;


import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.transaction.model.dtos.TransactionResponseDTO;
import org.springframework.stereotype.Service;

import java.util.function.Function;
@Service
public class TransactionResponseMapper implements Function<Transaction, TransactionResponseDTO> {
    @Override
    public TransactionResponseDTO apply(Transaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .createdAt(transaction.getCreated_at())
                .description(transaction.getDescription())
                .splitType(transaction.getSplitType())
                .type(transaction.getType())
                .build();
    }
}
