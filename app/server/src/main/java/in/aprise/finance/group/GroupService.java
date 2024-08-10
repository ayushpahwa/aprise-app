package in.aprise.finance.group;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.currency.CurrencyRepository;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupCurrency;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.GroupType;
import in.aprise.finance.group.model.dtos.CreateGroupRequestDTO;
import in.aprise.finance.group.model.dtos.CreateTransactionDTO;
import in.aprise.finance.group.model.dtos.GroupMemberResponseDTO;
import in.aprise.finance.group.model.dtos.GroupResponseDTO;
import in.aprise.finance.group.model.repository.GroupCurrencyRepository;
import in.aprise.finance.group.model.repository.GroupRepository;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.transaction.TransactionService;
import in.aprise.finance.transaction.model.dtos.TransactionResponseDTO;
import in.aprise.finance.user.model.User;
import in.aprise.finance.user.model.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupCurrencyRepository groupCurrencyRepository;
    private final CurrencyRepository currenciesRepository;
    private final GroupMemberService groupMemberService;
    private final UsersRepository userRepository;
    private final TransactionService transactionService;

    @Transactional
    public Group createGroupForUser(User user, Currency currency, GroupType groupType, String name, String description, Boolean isDefault) {
        Group group = Group.builder().type(groupType).name(name).description(description).createdAt(LocalDateTime.now()).build();

        try {
            groupRepository.save(group);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Failed to create group: " + e.getMessage());
        }

        try {
            // Add owner member to group
            groupMemberService.addMemberToGroup(group, user, true, isDefault);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Failed to create group owner: " + e.getMessage());
        }

        // Save user currency
        GroupCurrency groupCurrency = GroupCurrency.builder().group(group).currency(currency).isDefault(true).conversionRateToDefault(1).createdAt(LocalDateTime.now()).build();
        try {
            groupCurrencyRepository.save(groupCurrency);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Failed to create group currency: " + e.getMessage());
        }

        return group;
    }

    @Transactional
    public void createDefaultGroupForUser(User user, Currency currency) {
        createGroupForUser(user, currency, GroupType.PERSONAL, GroupType.PERSONAL.toString().toLowerCase() + " group", "Personal expenses", true);
    }

    @Transactional
    public GroupResponseDTO createGroup(CreateGroupRequestDTO request) {
        // get user token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User validatedUser = (User) authentication.getPrincipal();

        // Get currency from request
        var currency_id = request.getCurrencyId();
        var currency = currenciesRepository.findById(currency_id).orElseThrow(() -> new ApriseException(GlobalError.INVALID_CURRENCY));

        Group createdGroup;
        try {
            // Create group
            createdGroup = createGroupForUser(validatedUser, currency, request.getType(), request.getName(), request.getDescription(), false);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Failed to create group: " + e.getMessage());
        }

        List<GroupMemberResponseDTO> groupMembers = new ArrayList<>();
        // Add members to group
        request.getMembers().forEach(memberId -> {
            if (memberId == validatedUser.getId()) return; // skip if member is owner (current user)
            User member = userRepository.findById(memberId).orElseThrow(() -> new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Invalid member id: " + memberId));
            member.setId(memberId);
            try {
                var savedMember = groupMemberService.addMemberToGroup(createdGroup, member, false, false);
                groupMembers.add(savedMember.getMemberInfo());
            } catch (Exception e) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Failed to create new group member: " + e.getMessage());
            }
        });

        return GroupResponseDTO.builder().id(createdGroup.getId()).name(createdGroup.getName()).description(createdGroup.getDescription()).currencies(List.of(currency)).members(groupMembers).type(createdGroup.getType()).createdAt(createdGroup.getCreatedAt().toString()).build();
    }

    public List<GroupResponseDTO> getGroupsForCurrentUser() {
        // get user token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User validatedUser = (User) authentication.getPrincipal();

        // get groups from user
        List<Group> groups = groupRepository.findGroupsByUserId(validatedUser.getId());

        return groups.stream().map(group -> {
            List<Currency> currencies = group.getGroupCurrencies().stream().map(GroupCurrency::getCurrency).toList();
            List<GroupMemberResponseDTO> groupMembers = group.getGroupMembers().stream().map(GroupMember::getMemberInfo).toList();
            return GroupResponseDTO.builder()
                    .id(group.getId())
                    .name(group.getName())
                    .description(group.getDescription())
                    .currencies(currencies)
                    .type(group.getType())
                    .members(groupMembers)
                    .createdAt(group.getCreatedAt()
                            .toString()).build();
        }).toList();
    }

    public GroupMember validateGroupExists(long groupId) {
        // get user token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User validatedUser = (User) authentication.getPrincipal();

        // validate group exists
        groupRepository.existsById(groupId);

        // validate group membership
        return groupMemberService.validateGroupMembership(groupId, validatedUser.getId());
    }

    public GroupResponseDTO getGroup(long groupId) {
        Group group = (Group) getGroupObject(groupId).get("group");
        return GroupResponseDTO.builder().id(group.getId()).name(group.getName()).currencies(group.getGroupCurrencies().stream().map(GroupCurrency::getCurrency).toList()).type(group.getType()).createdAt(group.getCreatedAt().toString()).build();
    }

    public Map<String, Object> getGroupObject(long groupId) {
        GroupMember member = validateGroupExists(groupId);
        // get group from id
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new ApriseException(GlobalError.GENERIC_RESOURCE_NOT_FOUND, "Invalid group id: " + groupId));
        return new HashMap<>(Map.of("group", group, "member", member));
    }

    public List<TransactionResponseDTO> getGroupTransactions(long groupId) {
        validateGroupExists(groupId);
        return transactionService.getAllTransactionsForGroup(groupId);
    }

    @Transactional
    public TransactionResponseDTO createTransaction(CreateTransactionDTO request, Long groupId) {
        var groupObject = getGroupObject(groupId);
        return transactionService.createTransaction(request, (Group) groupObject.get("group"), (GroupMember) groupObject.get("member"));
    }
}
