package in.aprise.finance.group;

import in.aprise.finance.group.model.dtos.CreateGroupRequestDTO;
import in.aprise.finance.group.model.dtos.CreateTransactionDTO;
import in.aprise.finance.group.model.dtos.GroupResponseDTO;
import in.aprise.finance.shared.dtos.ResponseDTO;
import in.aprise.finance.transaction.model.dtos.TransactionResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    @GetMapping("")
    public ResponseDTO<Object> getGroups() {
        return new ResponseDTO<>(HttpStatus.OK.value(), groupService.getGroupsForCurrentUser(),"Groups fetched successfully");
    }

    @PostMapping("")
    public ResponseEntity<ResponseDTO<GroupResponseDTO>> createGroup(@RequestBody CreateGroupRequestDTO groupRequestDTO) {
        String message = "Group created successfully";
        HttpStatus status = HttpStatus.CREATED;
        GroupResponseDTO response = groupService.createGroup(groupRequestDTO);
        ResponseDTO<GroupResponseDTO> formattedResponse = new ResponseDTO<>(status.value(), response, message);
        return ResponseEntity.status(status).body(formattedResponse);
    }

    @GetMapping("/{groupId}")
    public ResponseDTO<Object> getGroup(@PathVariable Long groupId) {
        return new ResponseDTO<>(HttpStatus.OK.value(), groupService.getGroup(groupId),"Group fetched successfully");
    }

    @GetMapping("/{groupId}/transactions")
    public ResponseDTO<Object> getAllTransactionsForGroup(@PathVariable Long groupId) {
        return new ResponseDTO<>(HttpStatus.OK.value(), groupService.getGroupTransactions(groupId),"Transactions fetched successfully");
    }

    @PostMapping("/{groupId}/transactions")
    public ResponseEntity<ResponseDTO<TransactionResponseDTO>> createTransaction(@Valid @RequestBody CreateTransactionDTO request, @PathVariable Long groupId) {
        String message = "Transaction created successfully";
        HttpStatus status = HttpStatus.CREATED;
        TransactionResponseDTO response = groupService.createTransaction(request,groupId);
        ResponseDTO<TransactionResponseDTO> formattedResponse = new ResponseDTO<>(status.value(), response, message);
        return ResponseEntity.status(status).body(formattedResponse);
    }

}
