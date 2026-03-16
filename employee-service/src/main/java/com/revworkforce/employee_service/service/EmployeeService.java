package com.revworkforce.employee_service.service;

import com.revworkforce.employee_service.entity.Employee;
import java.util.List;
import java.util.Map;
public interface EmployeeService {

    Employee createEmployee(Employee employee);

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);

    Employee updateEmployee(Long id, Employee employee);

    void deleteEmployee(Long id);
    Map<String, Object> getEmployeeWithUser(Long id);
}