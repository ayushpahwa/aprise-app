package in.aprise.finance.group.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Entity(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    @Enumerated(EnumType.STRING)
    private GroupType type;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupCurrency> groupCurrencies;

    @JsonIgnore
    @OneToMany(mappedBy = "group")
    private List<GroupMember> groupMembers;
}
