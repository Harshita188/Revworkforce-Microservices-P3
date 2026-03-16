package com.revworkforce.leave_service.repository;

import com.revworkforce.leave_service.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.revworkforce.leave_service.entity.LeaveStatus;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);

    List<LeaveRequest> findByApprovedBy(Long managerId);
    // List<LeaveRequest> findByStatus(String status);
    List<LeaveRequest> findByStatus(LeaveStatus status);
}
