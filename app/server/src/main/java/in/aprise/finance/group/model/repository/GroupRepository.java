package in.aprise.finance.group.model.repository;

import in.aprise.finance.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT g FROM groups g JOIN group_members gm ON g.id = gm.group.id WHERE gm.user.id = ?1")
    List<Group> findGroupsByUserId(long id);
}
