package in.aprise.finance.transaction.model.repository;

import in.aprise.finance.transaction.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("Select t from transactions t "
            + "WHERE t.group.id = :groupId AND t.is_deleted = false")
    List<Transaction> findByGroupId(@Param("groupId") long groupId);
}
