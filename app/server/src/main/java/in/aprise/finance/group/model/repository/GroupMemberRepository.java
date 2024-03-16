package in.aprise.finance.group.model.repository;

import in.aprise.finance.group.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    Optional<GroupMember> findByGroupIdAndUserIdAndIsDeleted(long groupId, long userId, boolean isDeleted);
}
