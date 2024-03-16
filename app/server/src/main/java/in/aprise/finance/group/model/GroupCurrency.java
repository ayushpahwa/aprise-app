package in.aprise.finance.group.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.aprise.finance.currency.Currency;
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
@Entity(name = "group_currencies")
public class GroupCurrency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "group_id")
    Group group;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "currency_id")
    Currency currency;

    private boolean isDefault;
    private float conversionRateToDefault;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

}
