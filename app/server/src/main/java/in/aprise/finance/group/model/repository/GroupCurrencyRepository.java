package in.aprise.finance.group.model.repository;

import in.aprise.finance.group.model.GroupCurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupCurrencyRepository extends JpaRepository<GroupCurrency, Long> {
}
