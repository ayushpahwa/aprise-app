package in.aprise.finance.transaction.model.repository;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.GroupTestHelpers;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.repository.GroupMemberRepository;
import in.aprise.finance.group.model.repository.GroupRepository;
import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    TransactionRepository repositoryUnderTest;

    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private GroupMemberRepository gmRepository;
    @Autowired
    private CurrencyRepository currencyRepository;

    Group savedGroup;
    User savedUser;
    GroupMember savedGroupMember;
    Transaction savedTransaction;

    @BeforeEach
    void setUp() {
        var currency = new Currency(1, "USD", "USD");
        var gm = GroupTestHelpers.createDefaultGroupMember();
        var userToSave = gm.getUser();
        userToSave.setDefaultCurrency(currency);
        currencyRepository.save(currency);
        savedUser = usersRepository.save(userToSave);
        savedGroup = groupRepository.save(gm.getGroup());
        savedGroupMember = gmRepository.save(gm);
    }

    @Test
    void findByGroupId_itShouldReturnEmptyIfNoDataPresent() {
    }

    @Test
    void findByGroupId_itShouldTxnDataIfPresent() {
    }
}