package in.aprise.finance.transaction.model.repository;

import in.aprise.finance.transaction.model.TransactionMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionMemberRepository extends JpaRepository<TransactionMember, Long> {
}
