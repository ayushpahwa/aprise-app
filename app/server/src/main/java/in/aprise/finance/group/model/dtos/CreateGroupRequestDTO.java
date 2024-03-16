package in.aprise.finance.group.model.dtos;

import in.aprise.finance.group.model.GroupType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateGroupRequestDTO {

    @NotBlank(message = "Group name is mandatory")
    private String name;

    @NotBlank(message = "Group type is mandatory")
    private GroupType type;

    @NotBlank(message = "Currency is mandatory")
    @Size(min = 1, message = "Currency is mandatory")
    private int currencyId;

    @Size(min = 1, message = "Group members are mandatory")
    private List<Long> members;
}
