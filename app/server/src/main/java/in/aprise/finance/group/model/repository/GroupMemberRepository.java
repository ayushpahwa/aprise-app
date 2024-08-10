package in.aprise.finance.group.model.repository;

import in.aprise.finance.group.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    @Query("SELECT gm From group_members gm JOIN groups g ON g.id = gm.group.id " +
            "WHERE g.id = :groupId AND gm.user.id = :userId " +
            "AND gm.isDeleted = false AND g.isDeleted = false")
    Optional<GroupMember> findByGroupIdAndUserIdAndDeletedFlags(@Param("groupId") long groupId, @Param("userId") long userId);

}
