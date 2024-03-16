package in.aprise.finance.account;

import in.aprise.finance.account.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    @Query("SELECT a FROM accounts a WHERE a.user.id = :userId AND a.is_deleted = false")
    List<Account> findAccountsByUserId(@Param("userId") Long userId);
}
