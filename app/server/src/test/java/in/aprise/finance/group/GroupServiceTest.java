package in.aprise.finance.group;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupCurrency;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.GroupType;
import in.aprise.finance.group.model.repository.GroupCurrencyRepository;
import in.aprise.finance.group.model.repository.GroupRepository;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.transaction.TransactionService;
import in.aprise.finance.user.UserTestHelpers;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class GroupServiceTest {

    @InjectMocks
    private GroupService serviceUnderTest;

    @MockBean
    private GroupRepository groupRepository;
    @MockBean
    private GroupCurrencyRepository groupCurrencyRepository;
    @MockBean
    private CurrencyRepository currenciesRepository;
    @MockBean
    private GroupMemberService groupMemberService;
    @MockBean
    private UsersRepository userRepository;
    @MockBean
    private TransactionService transactionService;
    @MockBean
    private AuthenticationManager authenticationManager;

    private final Long validatedUserId = 1L;

    @BeforeEach
    void setUp() {
        serviceUnderTest = spy(new GroupService(groupRepository, groupCurrencyRepository, currenciesRepository, groupMemberService, userRepository, transactionService));
    }

    // This is only for tests that need the user to be logged in
    private void setupSecurityConfigMock() {

        // Mock the SecurityContext and Authentication
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);

        // User to be returned by the authentication.getPrincipal() method
        User user = UserTestHelpers.createDefaultUser();
        user.setId(validatedUserId);

        // When the security context's authentication is requested, return the mock authentication
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // When the authentication's principal is requested, return the mock user
        when(authentication.getPrincipal()).thenReturn(user);

        // Set the mocked security context to the SecurityContextHolder
        SecurityContextHolder.setContext(securityContext);

    }

    @Test
    void createGroupForUser_itShouldFailIfGroupCreationFails() {
        var errorMessage = "DB operation failed";
        // set mocks
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR, errorMessage)).when(groupRepository).save(ArgumentMatchers.any(Group.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroupForUser(new User(), new Currency(), GroupType.PERSONAL, "any", "any", true);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group: Internal server error while processing request: " + errorMessage, thrown.getMessage());

    }

    @Test
    void createGroupForUser_itShouldFailIfGroupOwnerCreationFails() {
        var errorMessage = "DB operation failed";
        // set mocks
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR, errorMessage)).when(groupMemberService)
                .addMemberToGroup(ArgumentMatchers.any(Group.class), ArgumentMatchers.any(User.class), ArgumentMatchers.any(Boolean.class), ArgumentMatchers.any(Boolean.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroupForUser(new User(), new Currency(), GroupType.PERSONAL, "any", "any", true);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group owner: Internal server error while processing request: " + errorMessage, thrown.getMessage());
    }

    @Test
    void createGroupForUser_itShouldFailIfGroupCurrencyCreationFails() {
        var errorMessage = "DB operation failed";
        // set mocks
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR, errorMessage)).when(groupCurrencyRepository).save(ArgumentMatchers.any(GroupCurrency.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroupForUser(new User(), new Currency(), GroupType.PERSONAL, "any", "any", true);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group currency: Internal server error while processing request: " + errorMessage, thrown.getMessage());
    }

    @Test
    void createGroupForUser_itShouldReturnSavedGroupOnSuccess() {
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
        var outputGroup = serviceUnderTest.createGroupForUser(inputUser, currency, expectedGroup.getType(), expectedGroup.getName(), expectedGroup.getDescription(), isDefault);

        // assert outputs: we'll set the created times as same first
        expectedGroup.setCreatedAt(outputGroup.getCreatedAt());
        assertEquals(expectedGroup, outputGroup);

        // verify: calls to functions with correct values
        verify(groupRepository).save(expectedGroup);
        verify(groupMemberService).addMemberToGroup(expectedGroup, inputUser, true, isDefault);

        // verify: group currency. Need to override values of created at here also
        ArgumentCaptor<GroupCurrency> groupCurrencyArgumentCaptorArgumentCaptor = ArgumentCaptor.forClass(GroupCurrency.class);
        verify(groupCurrencyRepository).save(groupCurrencyArgumentCaptorArgumentCaptor.capture());
        GroupCurrency capturedGCValue = groupCurrencyArgumentCaptorArgumentCaptor.getValue();
        expectedGroupCurrency.setCreatedAt(capturedGCValue.getCreatedAt());
        assertEquals(expectedGroupCurrency, capturedGCValue);

    }

    @Test
    void createDefaultGroupForUser_itShouldPassCorrectDefaultParams() {
        // prepare
        var inpurUser = UserTestHelpers.createDefaultUser();
        var inputCurrency = inpurUser.getDefaultCurrency();
        var defaultGroupType = GroupType.PERSONAL;
        var defaultGroupName = defaultGroupType.toString().toLowerCase() + " group";

        // when
        serviceUnderTest.createDefaultGroupForUser(inpurUser, inputCurrency);

        // verify
        verify(serviceUnderTest).createGroupForUser(inpurUser, inputCurrency, defaultGroupType, defaultGroupName, "Personal expenses", true);
    }

    @Test
    void createGroup_itShouldThrowErrorIfCurrencyNotFound() {
        // prepare
        setupSecurityConfigMock();
        var requestDTO = GroupTestHelpers.createDefaultGroupRequestDTO(validatedUserId);

        // set mocks
        when(currenciesRepository.findById(ArgumentMatchers.any(Integer.class))).thenReturn(Optional.empty());

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroup(requestDTO);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Invalid currency", thrown.getMessage());
    }

    @Test
    void createGroup_itShouldThrowErrorIfGroupCreationFails() {
        // prepare
        setupSecurityConfigMock();
        var requestDTO = GroupTestHelpers.createDefaultGroupRequestDTO(validatedUserId);
        var errorMessage = "Group failed to be created";

        // set mocks
        when(currenciesRepository.findById(1)).thenReturn(Optional.of(new Currency()));
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR, errorMessage)).when(serviceUnderTest).createGroupForUser(ArgumentMatchers.any(User.class), ArgumentMatchers.any(Currency.class), ArgumentMatchers.any(GroupType.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(Boolean.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroup(requestDTO);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create group: Internal server error while processing request: " + errorMessage, thrown.getMessage());

    }

    @Test
    void createGroup_itShouldThrowErrorIfMemberIdIsNotValidUser() {
        // prepare
        setupSecurityConfigMock();
        var requestDTO = GroupTestHelpers.createDefaultGroupRequestDTO(validatedUserId);
        var errorMessage = "Invalid member id: " + requestDTO.getMembers().get(1);

        // set mocks
        when(currenciesRepository.findById(1)).thenReturn(Optional.of(new Currency()));
        when(serviceUnderTest.createGroupForUser(ArgumentMatchers.any(User.class), ArgumentMatchers.any(Currency.class), ArgumentMatchers.any(GroupType.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(Boolean.class))).thenReturn(new Group());
        when(userRepository.findById(ArgumentMatchers.any(Long.class))).thenReturn(Optional.empty());

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroup(requestDTO);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: " + errorMessage, thrown.getMessage());

    }

    @Test
    void createGroup_itShouldThrowErrorIfMemberCreationFails() {
        // prepare
        setupSecurityConfigMock();
        var requestDTO = GroupTestHelpers.createDefaultGroupRequestDTO(validatedUserId);
        var errorMessage = "DB operation failed";

        // set mocks
        when(currenciesRepository.findById(1)).thenReturn(Optional.of(new Currency()));
        when(serviceUnderTest.createGroupForUser(ArgumentMatchers.any(User.class), ArgumentMatchers.any(Currency.class), ArgumentMatchers.any(GroupType.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(Boolean.class))).thenReturn(new Group());
        when(userRepository.findById(ArgumentMatchers.any(Long.class))).thenReturn(Optional.of(new User()));
        doThrow(new ApriseException(GlobalError.INTERNAL_SERVER_ERROR, errorMessage)).when(groupMemberService).addMemberToGroup(ArgumentMatchers.any(Group.class), ArgumentMatchers.any(User.class), ArgumentMatchers.any(Boolean.class), ArgumentMatchers.any(Boolean.class));

        // when
        ApriseException thrown = assertThrows(ApriseException.class, () -> {
            serviceUnderTest.createGroup(requestDTO);
        });

        // assert: the service should be throwing an aprise exception with the error message
        assertEquals("Bad request: Failed to create new group member: Internal server error while processing request: " + errorMessage, thrown.getMessage());

    }

    @Test
    void createGroup_itShouldReturnGroupInCorrectFormat() {
        // prepare
        setupSecurityConfigMock();
        var requestDTO = GroupTestHelpers.createDefaultGroupRequestDTO(validatedUserId);
        requestDTO.getMembers().add(3L);
        GroupMember mockGroupMember = GroupTestHelpers.createDefaultGroupMember();
        Group mockGroup = mockGroupMember.getGroup();
        mockGroup.setGroupMembers(List.of(mockGroupMember, mockGroupMember));
        mockGroup.setCreatedAt(LocalDateTime.now());
        Currency currency = new Currency(1, "USD", "USD");
        var expectedServiceResponse = GroupTestHelpers.createGroupResponseFromGroup(mockGroup, currency);

        // set mocks
        when(currenciesRepository.findById(1)).thenReturn(Optional.of(currency));
        when(serviceUnderTest.createGroupForUser(ArgumentMatchers.any(User.class), ArgumentMatchers.any(Currency.class), ArgumentMatchers.any(GroupType.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class), ArgumentMatchers.any(Boolean.class))).thenReturn(mockGroup);
        when(userRepository.findById(ArgumentMatchers.any(Long.class))).thenReturn(Optional.of(new User()));
        when(groupMemberService.addMemberToGroup(ArgumentMatchers.any(Group.class), ArgumentMatchers.any(User.class), ArgumentMatchers.any(Boolean.class), ArgumentMatchers.any(Boolean.class))).thenReturn(mockGroupMember);

        // when
        var serviceResponse = serviceUnderTest.createGroup(requestDTO);

        // assert: member validation was not called with owner's id (since owner is created along with group) and only with other members id
        verify(userRepository, never()).findById(requestDTO.getMembers().get(0));
        verify(userRepository, times(1)).findById(requestDTO.getMembers().get(1));
        verify(userRepository, times(1)).findById(requestDTO.getMembers().get(2));
        assertEquals(expectedServiceResponse, serviceResponse);
    }

    @Test
    void getGroupsForCurrentUser_itShouldReturnEmptyIfNoGroupsFound() {
        setupSecurityConfigMock();

        // set mocks
        when(groupRepository.findGroupsByUserId(1L)).thenReturn(new ArrayList<Group>());

        var serviceResponse = serviceUnderTest.getGroupsForCurrentUser();

        assertTrue(serviceResponse.isEmpty());
    }

    @Test
    void getGroupsFroCurrentUser_itShouldReturnGroupsInCorrectFormat() {
        // prepare: setup mocks for security config, group currencies and group members
        setupSecurityConfigMock();
        var mockGroupMember1 = GroupTestHelpers.createDefaultGroupMember();
        var mockGroup1 = mockGroupMember1.getGroup();
        GroupCurrency groupCurrency = new GroupCurrency(1L, mockGroup1, new Currency(), true, 1, false, LocalDateTime.now(), null);
        mockGroup1.setGroupCurrencies(List.of(groupCurrency));
        mockGroup1.setGroupMembers(List.of(mockGroupMember1));
        var mockGroupMember2 = GroupTestHelpers.createDefaultGroupMember();
        var mockGroup2 = mockGroupMember2.getGroup();
        mockGroup2.setGroupCurrencies(List.of(groupCurrency));
        mockGroup2.setGroupMembers(List.of(mockGroupMember2));
        List<Group> mockGroups = new ArrayList<>();
        mockGroups.add(mockGroup1);
        mockGroups.add(mockGroup2);

        // set mocks
        when(groupRepository.findGroupsByUserId(validatedUserId)).thenReturn(mockGroups);

        // when
        var serviceResponse = serviceUnderTest.getGroupsForCurrentUser();

        // assert
        assertFalse(serviceResponse.isEmpty());
        assertEquals(GroupTestHelpers.createDTOListFromGroupList(mockGroups), serviceResponse);
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