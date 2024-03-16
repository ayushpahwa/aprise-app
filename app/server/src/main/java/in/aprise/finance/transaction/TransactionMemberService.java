package in.aprise.finance.transaction;

import in.aprise.finance.account.AccountService;
import in.aprise.finance.account.model.Account;
import in.aprise.finance.group.GroupMemberService;
import in.aprise.finance.group.model.GroupMember;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.transaction.model.Transaction;
import in.aprise.finance.transaction.model.TransactionMember;
import in.aprise.finance.transaction.model.dtos.TransactionMemberRequestDTO;
import in.aprise.finance.transaction.model.dtos.TransactionMembersRequestDTO;
import in.aprise.finance.transaction.model.enums.TransactionContributorType;
import in.aprise.finance.transaction.model.enums.TransactionSplitType;
import in.aprise.finance.transaction.model.enums.TransactionType;
import in.aprise.finance.transaction.model.repository.TransactionMemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionMemberService {

    private final TransactionMemberRepository transactionMemberRepository;
    private final GroupMemberService groupMemberService;
    private final AccountService accountService;

    public void validateTransactionMembers(TransactionType type, TransactionMembersRequestDTO members) {
        // for income, members.input should be present
        // for expense, members.output should be present
        // for transfer, both members.input and members.output should be present
        // for transfer, members.input and members.output should be different
        if (type.equals(TransactionType.INCOME)) {
            if (members.getInput() == null) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Input member is mandatory for income transaction");
            }
            if (members.getOutput() != null) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Output member should not be present for income transaction");
            }
        } else if (type.equals(TransactionType.EXPENSE)) {
            if (members.getOutput() == null) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Output member is mandatory for expense transaction");
            }
            if (members.getInput() != null) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Input member should not be present for expense transaction");
            }
        } else if (type.equals(TransactionType.TRANSFER)) {
            if (members.getInput() == null) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Input member is mandatory for transfer transaction");
            }
            if (members.getOutput() == null) {
                throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, "Output member is mandatory for transfer transaction");
            }
        }
    }

    public void createTransactionMember(TransactionMemberRequestDTO member, Transaction transaction, TransactionContributorType contributionType, float share) {
        GroupMember groupMember = groupMemberService.validateGroupMembership(transaction.getGroup().getId(), member.getMemberId());
        Account account = groupMember.getUser().getUserAccounts().get(0);
        TransactionMember transactionMember = TransactionMember.builder()
                .transaction(transaction)
                .member(groupMember)
                .account(account)
                .contribution(contributionType)
                .amount(share)
                .created_at(LocalDateTime.now())
                .build();
        try {
            transactionMemberRepository.save(transactionMember);
        } catch (Exception e) {
            throw new ApriseException(GlobalError.GENERIC_BAD_REQUEST, e.getMessage());
        }
        accountService.updateBalance(account, share * (contributionType.equals(TransactionContributorType.INPUT) ? 1 : -1));
    }

    public void createTransactionMembers(Transaction transaction, TransactionMembersRequestDTO members) {
        TransactionType type = transaction.getType();
        TransactionSplitType splitType = transaction.getSplitType();
        float amount = transaction.getAmount();

        validateTransactionMembers(type, members);

        if (members.getInput() != null) {

            for (TransactionMemberRequestDTO member : members.getInput()) {
                float share = splitType.equals(TransactionSplitType.EQUAL) ? amount / members.getInput().size() : member.getShare();
                createTransactionMember(member, transaction, TransactionContributorType.INPUT, share);
            }
        }

        if (members.getOutput() != null) {
            for (TransactionMemberRequestDTO member : members.getOutput()) {
                float share = splitType.equals(TransactionSplitType.EQUAL) ? amount / members.getOutput().size() : member.getShare();
                createTransactionMember(member, transaction, TransactionContributorType.OUTPUT, share);
            }
        }
    }
}
