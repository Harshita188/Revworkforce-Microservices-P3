package com.revworkforce.employee_service.service;

import com.revworkforce.employee_service.entity.Employee;
import com.revworkforce.employee_service.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import com.revworkforce.employee_service.client.UserServiceClient;
import java.util.Map;
import java.util.HashMap;
import com.revworkforce.employee_service.repository.DepartmentRepository;
import com.revworkforce.employee_service.repository.DesignationRepository;
import com.revworkforce.employee_service.entity.Department;
import com.revworkforce.employee_service.entity.Designation;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserServiceClient userServiceClient;
    private final DepartmentService departmentService;
    private final DesignationService designationService;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    // @Override public Employee createEmployee(Employee employee) { return
    // employeeRepository.save(employee); }
    @Override
    public Employee createEmployee(Employee employee) {

        if (employee.getDepartment() != null && employee.getDepartment().getId() != null) {
            Department dept = departmentRepository
                    .findById(employee.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            employee.setDepartment(dept);
        }

        if (employee.getDesignation() != null && employee.getDesignation().getId() != null) {
            Designation des = designationRepository
                    .findById(employee.getDesignation().getId())
                    .orElseThrow(() -> new RuntimeException("Designation not found"));
            employee.setDesignation(des);
        }

        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public Employee updateEmployee(Long id, Employee employee) {

        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existing.setFirstName(employee.getFirstName());
        existing.setLastName(employee.getLastName());
        existing.setPhone(employee.getPhone());
        existing.setAddress(employee.getAddress());
        existing.setJoiningDate(employee.getJoiningDate());
        existing.setStatus(employee.getStatus());
        existing.setDepartment(employee.getDepartment());
        existing.setDesignation(employee.getDesignation());

        return employeeRepository.save(existing);
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public Map<String, Object> getEmployeeWithUser(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Map<String, Object> user = userServiceClient.getUserById(employee.getUserId());

        Map<String, Object> response = new HashMap<>();
        response.put("employee", employee);
        response.put("user", user);

        return response;
    }
}