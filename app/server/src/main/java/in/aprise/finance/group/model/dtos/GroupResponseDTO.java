package in.aprise.finance.group.model.dtos;

import in.aprise.finance.currency.Currency;
import in.aprise.finance.group.model.GroupType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupResponseDTO {

    private long id;
    private String name;
    private List<Currency> currencies;
    private GroupType type;
    private String createdAt;
}
