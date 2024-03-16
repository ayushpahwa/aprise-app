package in.aprise.finance.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.aprise.finance.account.model.Account;
import in.aprise.finance.currency.Currency;
import in.aprise.finance.group.model.GroupMember;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "name can't be blank")
    private String fullName;

    @NotBlank(message = "email can't be blank")
    @Email(message = "invalid format")
    private String email;

    @NotBlank(message = "password can't be blank")
    private String hashPassword;
    private String authData;
    private boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "id")
    private Currency defaultCurrency;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Account> userAccounts;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<GroupMember> userGroups;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return hashPassword;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return deletedAt == null;
    }

    @Override
    public boolean isAccountNonLocked() {
        return deletedAt == null;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return deletedAt == null;
    }

    @Override
    public boolean isEnabled() {
        return deletedAt == null;
    }
}
