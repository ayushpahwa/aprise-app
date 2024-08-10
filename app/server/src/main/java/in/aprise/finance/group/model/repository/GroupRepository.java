package in.aprise.finance.group.model.repository;

import in.aprise.finance.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT g FROM groups g JOIN group_members gm ON g.id = gm.group.id" +
            " WHERE gm.user.id = :userId AND gm.isDeleted = false AND g.isDeleted = false")
    List<Group> findGroupsByUserId(@Param("userId") long id);

    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END " +
            "FROM groups g JOIN group_members gm ON g.id = gm.group.id " +
            "WHERE g.id = :groupId AND gm.user.id = :userId " +
            "AND gm.isDeleted = false AND g.isDeleted = false")
    boolean existsByIdAndUserId(@Param("groupId") long groupId, @Param("userId") long userId);


}
