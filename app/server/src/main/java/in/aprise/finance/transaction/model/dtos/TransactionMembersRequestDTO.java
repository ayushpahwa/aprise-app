package in.aprise.finance.transaction.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionMembersRequestDTO {

    private List<TransactionMemberRequestDTO> input;
    private List<TransactionMemberRequestDTO> output;
}
