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

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class GroupRepositoryTest {

    @Autowired
    private GroupRepository repositoryUnderTest;

    @Autowired private UsersRepository usersRepository;
    @Autowired private GroupMemberRepository gmRepository;
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
        savedGroup = repositoryUnderTest.save(gm.getGroup());
        savedGroupMember = gmRepository.save(gm);
    }

    @AfterEach
    void tearDown() {
        repositoryUnderTest.deleteAll();
    }

    @Test
    void itShouldReturnEmptyIfUserHasNoGroups() {
        // prepare: take a user id that is different from the one saved in setup
        var fakeUserId = savedUser.getId() + 1L;

        // act: try fetching groups with the fake userId
        var fetchedGroup = repositoryUnderTest.findGroupsByUserId(fakeUserId);

        // assert
        assertTrue(fetchedGroup.isEmpty());
    }

    @Test
    void itShouldReturnEmptyIfUserIsNoLongerGroupMember() {
        // prepare: update the stored group member entry as deleted
        savedGroupMember.setDeleted(true);
        gmRepository.save(savedGroupMember);

        // act: try fetching groups with the saved user's userId
        var fetchedGroup = repositoryUnderTest.findGroupsByUserId(savedUser.getId());

        // assert
        assertTrue(fetchedGroup.isEmpty());
    }

    @Test
    void itShouldReturnEmptyIfGroupHasBeenDeleted() {
        // prepare: update the stored group entry as deleted
        savedGroup.setDeleted(true);
        repositoryUnderTest.save(savedGroup);

        // act: try fetching groups with the saved user's userId
        var fetchedGroup = repositoryUnderTest.findGroupsByUserId(savedUser.getId());

        // assert
        assertTrue(fetchedGroup.isEmpty());
    }

    @Test
    void itShouldReturnGroupDataIfAllDataIsPresent() {
        // prepare: create array with saved group, since the db function returns all groups of the user
        List<Group> expectedGroups = new ArrayList<>();
        expectedGroups.add(savedGroup);


        // act: try fetching groups with the fake userId
        var fetchedGroup = repositoryUnderTest.findGroupsByUserId(savedUser.getId());

        // assert: group
        assertEquals(expectedGroups,fetchedGroup);
    }
}