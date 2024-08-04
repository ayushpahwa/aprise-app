package in.aprise.finance.group.model.repository;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.GroupTestHelpers;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class GroupMemberRepositoryTest {

    @Autowired
    private GroupMemberRepository repositoryUnderTest;

    @Autowired private UsersRepository usersRepository;
    @Autowired private GroupRepository groupRepository;
    @Autowired private CurrencyRepository currencyRepository;

    Group savedGroup;
    User savedUser;
    GroupMember savedGroupMember;

    @BeforeEach
    void setUp() {
        var currency = new Currency(1, "USD", "USD");
        var gm = GroupTestHelpers.createDefaultGroupMember();
        var userToSave = gm.getUser();
        userToSave.setDefaultCurrency(currency);
        currencyRepository.save(currency);
        savedUser = usersRepository.save(userToSave);
        savedGroup = groupRepository.save(gm.getGroup());
        savedGroupMember = repositoryUnderTest.save(gm);
    }

    @AfterEach
    void tearDown() {
        repositoryUnderTest.deleteAll();
    }

    @Test
    void itShouldReturnEmptyIfNoEntriesFoundForUserId() {
        // prepare: create fake id which doesn't have entry
        var fakeUserId = savedUser.getId() + 1L;

        // act: run the fetch function with fake user id
        var fetchedGroupMemberRecord = repositoryUnderTest.findByGroupIdAndUserIdAndIsDeleted(savedGroup.getId(),fakeUserId,false);

        // assert
        assert(fetchedGroupMemberRecord.isEmpty());
    }

    @Test
    void itShouldReturnEmptyIfNoEntriesFoundForGroupIdForTheUser() {
        // prepare: create fake id which doesn't have entry
        var fakeGroupId = savedGroup.getId() + 1L;

        // act: run the fetch function with fake user id
        var fetchedGroupMemberRecord = repositoryUnderTest.findByGroupIdAndUserIdAndIsDeleted(fakeGroupId,savedUser.getId(),false);

        // assert
        assert(fetchedGroupMemberRecord.isEmpty());
    }

    @Test
    void itShouldReturnEmptyIfEntryIsMarkedAsDeleted() {
        // prepare: update saved group member record and set deleted flag as true
        savedGroupMember.setDeleted(true);
        repositoryUnderTest.save(savedGroupMember);

        // act: run the fetch function
        var fetchedGroupMemberRecord = repositoryUnderTest
                .findByGroupIdAndUserIdAndIsDeleted(savedGroup.getId(),savedUser.getId(),false);

        // assert
        assert(fetchedGroupMemberRecord.isEmpty());
    }

    @Test
    void itShouldReturnEntryWithGroupMembership() {
        // act: run the fetch function
        var fetchedGroupMemberRecord = repositoryUnderTest
                .findByGroupIdAndUserIdAndIsDeleted(savedGroup.getId(),savedUser.getId(),false);

        // assert
        assertEquals(savedGroupMember,fetchedGroupMemberRecord.orElseThrow());
    }
}