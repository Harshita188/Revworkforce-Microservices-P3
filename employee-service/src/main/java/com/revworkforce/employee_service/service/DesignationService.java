package com.revworkforce.employee_service.service;

import com.revworkforce.employee_service.entity.Designation;
import java.util.List;

public interface DesignationService {

    Designation createDesignation(Designation designation);

    List<Designation> getAllDesignations();

    Designation getDesignationById(Long id);

    Designation updateDesignation(Long id, Designation designation);

    void deleteDesignation(Long id);
}