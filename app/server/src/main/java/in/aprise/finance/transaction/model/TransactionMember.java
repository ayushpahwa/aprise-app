package in.aprise.finance.transaction.model;

import in.aprise.finance.account.model.Account;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.transaction.model.enums.TransactionContributorType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "transaction_members")
public class TransactionMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TransactionContributorType contribution;
    private float amount;
    private boolean is_deleted;
    private LocalDateTime created_at;
    private LocalDateTime deleted_at;

    @ManyToOne
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "member_account_id", referencedColumnName = "id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private GroupMember member;
}
