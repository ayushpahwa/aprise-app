package in.aprise.finance.transaction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.transaction.model.enums.TransactionSplitType;
import in.aprise.finance.transaction.model.enums.TransactionType;
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
@Entity(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private float amount;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    @Enumerated(EnumType.STRING)
    private TransactionSplitType splitType;
    private String description;
    private boolean is_deleted;
    private LocalDateTime created_at;
    private LocalDateTime deleted_at;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "id")
    private Currency currency;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "category", referencedColumnName = "id")
    private Category category;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "created_by", referencedColumnName = "id")
    private GroupMember createdByMember;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;

}
