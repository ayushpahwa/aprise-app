package in.aprise.finance.group.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.aprise.finance.user.model.User;
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
@Entity(name = "group_members")
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "member_id")
    User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "group_id")
    Group group;

    private boolean isDefault;
    private boolean isOwner;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
}
