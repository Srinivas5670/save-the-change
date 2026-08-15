package com.savethechange.backend.controller;

import com.savethechange.backend.entity.Admin;
import com.savethechange.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/register")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        Admin savedAdmin = adminService.saveAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody Admin admin) {

        Optional<Admin> existingAdmin =
                adminService.findByUsername(admin.getUsername());

        if (existingAdmin.isPresent()
                && existingAdmin.get().getPassword().equals(admin.getPassword())) {

            return ResponseEntity.ok("Admin login successful");
        }

        return ResponseEntity.status(401)
                .body("Invalid username or password");
    }
}