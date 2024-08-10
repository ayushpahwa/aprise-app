package in.aprise.finance.group;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupCurrency;
import in.aprise.finance.group.model.GroupType;
import in.aprise.finance.group.model.repository.GroupCurrencyRepository;
import in.aprise.finance.group.model.repository.GroupRepository;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.transaction.TransactionService;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class GroupServiceTest {

    private GroupService serviceUnderTest;

    @MockBean GroupRepository groupRepository;
    @MockBean GroupCurrencyRepository groupCurrencyRepository;
    @MockBean CurrencyRepository currenciesRepository;
    @MockBean GroupMemberService groupMemberService;
    @MockBean UsersRepository userRepository;
    @MockBean TransactionService transactionService;

    @BeforeEach
    void setUp() {
        serviceUnderTest = new GroupService(groupRepository,groupCurrencyRepository,currenciesRepository,groupMemberService,userRepository,transactionService);
    }

    @Test
    void itShouldFailIfGroupCreationFails() {
        var errorMessage = "DB operation failed";
        // set mocks
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR,errorMessage)).when(groupRepository).save(ArgumentMatchers.any(Group.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()->{
            serviceUnderTest.createGroupForUser(new User(),new Currency(), GroupType.PERSONAL,"any","any",true);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group: Internal server error while processing request: "+ errorMessage,thrown.getMessage());

    }

    @Test
    void itShouldFailIfGroupOwnerCreationFails() {
        var errorMessage = "DB operation failed";
        // set mocks
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR,errorMessage)).when(groupMemberService)
                .addMemberToGroup(ArgumentMatchers.any(Group.class),ArgumentMatchers.any(User.class),ArgumentMatchers.any(Boolean.class),ArgumentMatchers.any(Boolean.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()->{
            serviceUnderTest.createGroupForUser(new User(),new Currency(), GroupType.PERSONAL,"any","any",true);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group owner: Internal server error while processing request: "+ errorMessage,thrown.getMessage());
    }

    @Test
    void itShouldFailIfGroupCurrencyCreationFails() {
        var errorMessage = "DB operation failed";
        // set mocks
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR,errorMessage)).when(groupCurrencyRepository).save(ArgumentMatchers.any(GroupCurrency.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()->{
            serviceUnderTest.createGroupForUser(new User(),new Currency(), GroupType.PERSONAL,"any","any",true);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group currency: Internal server error while processing request: "+ errorMessage,thrown.getMessage());
    }

    @Test
    void itShouldReturnSavedGroupOnSuccess() {
        // prepare
        var groupOwner = GroupTestHelpers.createDefaultGroupMember();
        var expectedGroup = groupOwner.getGroup();
        var inputUser = groupOwner.getUser();
        var currency = inputUser.getDefaultCurrency();
        var expectedGroupCurrency = new GroupCurrency();
        expectedGroupCurrency.setGroup(expectedGroup);
        expectedGroupCurrency.setCurrency(currency);
        expectedGroupCurrency.setDefault(true);
        expectedGroupCurrency.setConversionRateToDefault(1);
        var isDefault = true;

        // when
        var outputGroup = serviceUnderTest.createGroupForUser(inputUser,currency, expectedGroup.getType(), expectedGroup.getName(), expectedGroup.getDescription(),isDefault);

        // assert outputs: we'll set the created times as same first
        expectedGroup.setCreatedAt(outputGroup.getCreatedAt());
        assertEquals(expectedGroup, outputGroup);

        // verify: calls to functions with correct values
        verify(groupRepository).save(expectedGroup);
        verify(groupMemberService).addMemberToGroup(expectedGroup, inputUser,true,isDefault);

        // verify: group currency. Need to override values of created at here also
        ArgumentCaptor<GroupCurrency> groupCurrencyArgumentCaptorArgumentCaptor = ArgumentCaptor.forClass(GroupCurrency.class);
        verify(groupCurrencyRepository).save(groupCurrencyArgumentCaptorArgumentCaptor.capture());
        GroupCurrency capturedGCValue = groupCurrencyArgumentCaptorArgumentCaptor.getValue();
        expectedGroupCurrency.setCreatedAt(capturedGCValue.getCreatedAt());
        assertEquals(expectedGroupCurrency,capturedGCValue);

    }

    @Test
    void createDefaultGroupForUser() {
    }

    @Test
    void createGroup() {
    }

    @Test
    void getGroupsForCurrentUser() {
    }

    @Test
    void validateGroupExists() {
    }

    @Test
    void getGroup() {
    }

    @Test
    void getGroupObject() {
    }

    @Test
    void getGroupTransactions() {
    }

    @Test
    void createTransaction() {
    }
}