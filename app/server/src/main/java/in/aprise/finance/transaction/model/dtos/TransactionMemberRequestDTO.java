package in.aprise.finance.transaction.model.dtos;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionMemberRequestDTO {

    private long memberId;
    private float share;
}
