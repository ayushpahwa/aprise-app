package in.aprise.finance.group;

import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.group.model.repository.GroupMemberRepository;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;

    public void addMemberToGroup(Group group, User user, boolean isOwner, Boolean isDefault) {
        GroupMember groupMember = GroupMember.builder().group(group).user(user).isOwner(isOwner).isDefault(isDefault).build();
        try {
            groupMemberRepository.save(groupMember);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, e.getMessage());
        }
    }

    public GroupMember validateGroupMembership(long groupId, long user) {
        return groupMemberRepository.findByGroupIdAndUserIdAndIsDeleted(groupId, user,false).orElseThrow(() -> new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "User is not a member of the group"));
    }
}
