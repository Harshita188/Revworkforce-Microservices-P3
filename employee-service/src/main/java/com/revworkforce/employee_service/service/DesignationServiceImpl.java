package com.revworkforce.employee_service.service;

import com.revworkforce.employee_service.entity.Designation;
import com.revworkforce.employee_service.repository.DesignationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;

    @Override
    public Designation createDesignation(Designation designation) {
        return designationRepository.save(designation);
    }

    @Override
    public List<Designation> getAllDesignations() {
        return designationRepository.findAll();
    }

    @Override
    public Designation getDesignationById(Long id) {
        return designationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found"));
    }

    @Override
    public Designation updateDesignation(Long id, Designation designation) {

        Designation existing = designationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found"));

        existing.setTitle(designation.getTitle());

        return designationRepository.save(existing);
    }

    @Override
    public void deleteDesignation(Long id) {
        designationRepository.deleteById(id);
    }
}