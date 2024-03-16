package in.aprise.finance.account.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.transaction.model.TransactionMember;
import in.aprise.finance.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private AccountTypes type;
    private float current_balance;
    private float starting_balance;
    private boolean is_deleted;
    private LocalDateTime created_at;
    private LocalDateTime deleted_at;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "id")
    private Currency currency;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id",referencedColumnName = "id")
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TransactionMember> transactionMembers;
}
