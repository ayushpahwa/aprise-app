package in.aprise.finance.transaction.model.repository;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.GroupTestHelpers;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.repository.GroupMemberRepository;
import in.aprise.finance.group.model.repository.GroupRepository;
import in.aprise.finance.transaction.TransactionTestHelpers;
import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
    Currency savedCurrency;

    @BeforeEach
    void setUp() {
        var currency = new Currency(1, "USD", "USD");
        var gm = GroupTestHelpers.createDefaultGroupMember();
        var userToSave = gm.getUser();
        userToSave.setDefaultCurrency(currency);

        savedCurrency = currencyRepository.save(currency);
        savedUser = usersRepository.save(userToSave);
        savedGroup = groupRepository.save(gm.getGroup());
        savedGroupMember = gmRepository.save(gm);

        var transaction = TransactionTestHelpers.createDefaultTxn();
        transaction.setCurrency(savedCurrency);
        transaction.setCreatedByMember(savedGroupMember);
        transaction.setGroup(savedGroup);
        savedTransaction = repositoryUnderTest.save(transaction);
    }

    @AfterEach
    void tearDown() {
        repositoryUnderTest.deleteAll();
    }

    @Test
    void findByGroupId_itShouldReturnEmptyIfNoDataPresent() {
        // prepare
        var fakeGroupId = savedGroup.getId() + 1L;

        // act
        var response = repositoryUnderTest.findByGroupId(fakeGroupId);

        // assert
        assertTrue(response.isEmpty());
    }

    @Test
    void findByGroupId_itShouldReturnEmptyIfTxnIsMarkedDeleted() {
        // prepare
        savedTransaction.set_deleted(true);
        repositoryUnderTest.save(savedTransaction);

        // act
        var response = repositoryUnderTest.findByGroupId(savedGroup.getId());

        // assert
        assertTrue(response.isEmpty());
    }

    @Test
    void findByGroupId_itShouldTxnDataIfPresent() {
        // prepare: let's create another transaction to be added
        var transaction = TransactionTestHelpers.createDefaultTxn();
        transaction.setCurrency(savedCurrency);
        transaction.setCreatedByMember(savedGroupMember);
        transaction.setGroup(savedGroup);
        var savedTransaction2 = repositoryUnderTest.save(transaction);

        List<Transaction> expectedResponse = new ArrayList<>();
        expectedResponse.add(savedTransaction);
        expectedResponse.add(savedTransaction2);

        // act
        var response = repositoryUnderTest.findByGroupId(savedGroup.getId());

        // assert
        assertEquals(expectedResponse, response);
    }

    @Test
    void findByGroupId_itShouldReturnNotDeletedTxnDataOnly() {
        // prepare: let's create another transaction to be added and set one as deleted
        var transaction = TransactionTestHelpers.createDefaultTxn();
        transaction.setCurrency(savedCurrency);
        transaction.setCreatedByMember(savedGroupMember);
        transaction.setGroup(savedGroup);
        var savedTransaction2 = repositoryUnderTest.save(transaction);
        savedTransaction.set_deleted(true);
        repositoryUnderTest.save(savedTransaction);

        List<Transaction> expectedResponse = new ArrayList<>();
        expectedResponse.add(savedTransaction2);

        // act
        var response = repositoryUnderTest.findByGroupId(savedGroup.getId());

        // assert
        assertEquals(expectedResponse, response);
    }
}