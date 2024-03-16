package in.aprise.finance.transaction;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.dtos.CreateTransactionDTO;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.transaction.model.dtos.TransactionResponseDTO;
import in.aprise.finance.transaction.model.mapper.TransactionResponseMapper;
import in.aprise.finance.transaction.model.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CurrencyRepository currencyRepository;
    private final TransactionResponseMapper transactionResponseMapper;
    private final TransactionMemberService transactionMemberService;

    public List<TransactionResponseDTO> getAllTransactionsForGroup(long groupId) {
        return transactionRepository.findByGroupId(groupId).stream().map(transactionResponseMapper).toList();
    }

    @Transactional
    public TransactionResponseDTO createTransaction(CreateTransactionDTO request, Group group, GroupMember creatingMember) {

        Currency currency = currencyRepository.findById(request.getCurrency_id()).orElseThrow(() -> new ApriseException(GlobalError.INVALID_CURRENCY, "Invalid currency"));

        Transaction transaction = Transaction.builder()
                .currency(currency)
                .group(group)
                .amount(request.getAmount())
                .type(request.getType())
                .splitType(request.getSplit_type())
                .description(request.getDescription())
                .createdByMember(creatingMember)
                .created_at(LocalDateTime.now())
                .build();
        try {
            transactionRepository.save(transaction);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, e.getMessage());
        }

        transactionMemberService.createTransactionMembers(transaction, request.getMembers());

        return transactionResponseMapper.apply(transaction);
    }
}
