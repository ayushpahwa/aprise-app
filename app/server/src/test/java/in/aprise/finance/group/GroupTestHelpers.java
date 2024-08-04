package in.aprise.finance.group;

import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.GroupType;
import in.aprise.finance.user.UserTestHelpers;

public class GroupTestHelpers {

    public static Group createDefaultGroup() {
        return Group.builder()
                .name("Some group")
                .description("My testing group")
                .type(GroupType.PERSONAL)
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
}
