package com.revworkforce.employee_service.controller;

import com.revworkforce.employee_service.entity.Designation;
import com.revworkforce.employee_service.service.DesignationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/designations")
@RequiredArgsConstructor
public class DesignationController {

    private final DesignationService designationService;

    @PostMapping
    public Designation createDesignation(@RequestBody Designation designation) {
        return designationService.createDesignation(designation);
    }

    @GetMapping
    public List<Designation> getAllDesignations() {
        return designationService.getAllDesignations();
    }

    @GetMapping("/{id}")
    public Designation getDesignationById(@PathVariable Long id) {
        return designationService.getDesignationById(id);
    }

    @PutMapping("/{id}")
    public Designation updateDesignation(@PathVariable Long id,
                                         @RequestBody Designation designation) {
        return designationService.updateDesignation(id, designation);
    }

    @DeleteMapping("/{id}")
    public void deleteDesignation(@PathVariable Long id) {
        designationService.deleteDesignation(id);
    }
}