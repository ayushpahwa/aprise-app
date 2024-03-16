package in.aprise.finance.transaction;

import in.aprise.finance.shared.dtos.ResponseDTO;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.transaction.model.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;

    @GetMapping("/{transactionId}")
    public ResponseDTO<Transaction> getAllTransactionsForGroup(@PathVariable long transactionId) {

        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Transaction not found"));
        return new ResponseDTO<>(HttpStatus.OK.value(), transaction, "Transaction fetched successfully");
    }
}
