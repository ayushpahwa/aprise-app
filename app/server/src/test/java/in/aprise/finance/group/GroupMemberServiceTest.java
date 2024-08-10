package in.aprise.finance.group;

import in.aprise.finance.group.model.Group;
import in.aprise.finance.group.model.repository.GroupMemberRepository;
import in.aprise.finance.shared.exception.ApriseException;
import in.aprise.finance.shared.exception.GlobalError;
import in.aprise.finance.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
class GroupMemberServiceTest {

    private GroupMemberService serviceUnderTest;

    @MockBean
    private GroupMemberRepository groupMemberRepository;

    @BeforeEach
    void setUp() {
        serviceUnderTest = new GroupMemberService(groupMemberRepository);
    }

    @Test
    void itShouldThrowErrorIfSaveMemberDBOpFails() {
        // set Mock
        doThrow(new ApriseException(GlobalError.GENERIC_BAD_REQUEST))
                .when(groupMemberRepository)
                .save(ArgumentMatchers.any());

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()-> {
            serviceUnderTest.addMemberToGroup(new Group(), new User(), true, true);
        });

        // assert
        assertTrue(thrown.getMessage().contains(GlobalError.GENERIC_BAD_REQUEST.getMessage()));
    }

    @Test
    void itShouldReturnCorrectData() {
        // prepare
        var isDefault = true;
        var isOwner = true;
        var groupMember = GroupTestHelpers.createDefaultGroupMember();
        groupMember.setDefault(isDefault);
        groupMember.setDefault(isOwner);

        // when
        serviceUnderTest.addMemberToGroup(groupMember.getGroup(), groupMember.getUser(), isOwner, isDefault);

        // then
        verify(groupMemberRepository).save(groupMember);
    }

    @Test
    void itShouldThrowErrorIfDBOpReturnsEmpty() {
        // set mock
        when(groupMemberRepository
                .findByGroupIdAndUserIdAndIsDeleted
                        (ArgumentMatchers.any(Long.class),ArgumentMatchers.any(Long.class),ArgumentMatchers.any(Boolean.class)))
                .thenReturn(Optional.empty());

        // when
        ApriseException thrown = assertThrows(ApriseException.class,()->{
           serviceUnderTest.validateGroupMembership(1L,1L);
        });

        // assert
        assertEquals("Bad request: User is not a member of the group",thrown.getMessage());
    }

    @Test
    void itShouldReturnStoredGroupMember() {
        // prepare
        var groupMember = GroupTestHelpers.createDefaultGroupMember();
        when(groupMemberRepository
                .findByGroupIdAndUserIdAndIsDeleted
                        (ArgumentMatchers.any(Long.class),ArgumentMatchers.any(Long.class),ArgumentMatchers.any(Boolean.class)))
                .thenReturn(Optional.of(groupMember));

        // when
        var output = serviceUnderTest.validateGroupMembership(groupMember.getGroup().getId(),groupMember.getUser().getId());

        // then
        verify(groupMemberRepository).findByGroupIdAndUserIdAndIsDeleted(groupMember.getGroup().getId(),groupMember.getUser().getId(),false);
        assertEquals(groupMember, output);
    }
}