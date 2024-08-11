package in.aprise.finance.transaction;

import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.transaction.model.mapper.TransactionResponseMapper;
import in.aprise.finance.transaction.model.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class TransactionServiceTest {

    private TransactionService serviceUnderTest;

    @MockBean
    private TransactionRepository transactionRepository;
    @MockBean
    private CurrencyRepository currencyRepository;
    @MockBean
    private TransactionResponseMapper transactionResponseMapper;
    @MockBean
    private TransactionMemberService transactionMemberService;

    @BeforeEach
    void setUp() {
        serviceUnderTest = new TransactionService(transactionRepository, currencyRepository, transactionResponseMapper, transactionMemberService);
    }

    @Test
    void getAllTransactionsForGroup() {
    }

    @Test
    void createTransaction() {
    }
}