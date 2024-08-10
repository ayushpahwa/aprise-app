package in.aprise.finance.group;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.GroupType;
import in.aprise.finance.group.model.dtos.CreateGroupRequestDTO;
import in.aprise.finance.group.model.dtos.GroupMemberResponseDTO;
import in.aprise.finance.group.model.dtos.GroupResponseDTO;
import in.aprise.finance.user.UserTestHelpers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class GroupTestHelpers {

    public static Group createDefaultGroup() {
        return Group.builder()
                .name("Some group")
                .description("My testing group")
                .type(GroupType.PERSONAL)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static GroupMember createDefaultGroupMember() {
        var group = createDefaultGroup();
        var user = UserTestHelpers.createDefaultUser();
        return GroupMember.builder()
                .group(group)
                .user(user)
                .isOwner(true)
                .isDefault(true)
                .build();
    }

    public static CreateGroupRequestDTO createDefaultGroupRequestDTO(Long ownerId) {
        List<Long> memberList = new ArrayList<>();
        memberList.add(ownerId);
        memberList.add(2L);

        return CreateGroupRequestDTO.builder()
                .name("Some group")
                .description("My testing group")
                .type(GroupType.PERSONAL)
                .currencyId(1)
                .members(memberList)
                .build();
    }

    public static GroupResponseDTO createGroupResponseFromGroup(Group group, Currency currency) {
        List<GroupMemberResponseDTO> groupMembers = group.getGroupMembers().stream().map(GroupMember::getMemberInfo).toList();
        return GroupResponseDTO.builder().id(group.getId()).name(group.getName()).description(group.getDescription()).currencies(List.of(currency)).type(group.getType()).members(groupMembers).createdAt(group.getCreatedAt().toString()).build();
    }

    public static List<GroupResponseDTO> createDTOListFromGroupList(List<Group> groupList) {
        return groupList.stream().map(group -> createGroupResponseFromGroup(group, group.getGroupCurrencies().get(0).getCurrency())).toList();
    }
}
