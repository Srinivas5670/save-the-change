package com.savethechange.backend.controller;

import com.savethechange.backend.dto.CustomerProfileResponse;
import com.savethechange.backend.dto.TransferRequest;
import com.savethechange.backend.entity.Customer;
import com.savethechange.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> registerCustomer(
            @RequestBody Customer customer) {

        Customer savedCustomer =
                customerService.saveCustomer(customer);

        return ResponseEntity.ok(savedCustomer);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginCustomer(
            @RequestBody Customer customer) {

        Optional<Customer> existingCustomer =
                customerService.findByMobileNumber(
                        customer.getMobileNumber());

        if (existingCustomer.isPresent()
                && existingCustomer.get()
                .getPassword()
                .equals(customer.getPassword())) {

            return ResponseEntity.ok(
                    "Customer login successful");
        }

        return ResponseEntity.status(401)
                .body("Invalid mobile number or password");
    }

    @GetMapping("/{mobileNumber}")
    public ResponseEntity<Customer> getCustomer(
            @PathVariable String mobileNumber) {

        Optional<Customer> customer =
                customerService.findByMobileNumber(
                        mobileNumber);

        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/add-balance")
    public ResponseEntity<Customer> addBalance(
            @RequestParam String mobileNumber,
            @RequestParam double amount) {

        Customer customer =
                customerService.addBalance(
                        mobileNumber,
                        amount);

        return ResponseEntity.ok(customer);
    }

    @PostMapping("/use-balance")
    public ResponseEntity<Customer> useBalance(
            @RequestParam String mobileNumber,
            @RequestParam double amount) {

        Customer customer =
                customerService.useBalance(
                        mobileNumber,
                        amount);

        return ResponseEntity.ok(customer);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferMoney(
            @Valid @RequestBody TransferRequest request) {

        String result =
                customerService.transferMoney(
                        request.getSenderMobile(),
                        request.getReceiverMobile(),
                        request.getAmount());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/profile/{mobileNumber}")
    public ResponseEntity<?> getCustomerProfile(
            @PathVariable String mobileNumber) {

        Optional<Customer> customer =
                customerService.findByMobileNumber(
                        mobileNumber);

        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer existingCustomer =
                customer.get();

        CustomerProfileResponse profile =
                new CustomerProfileResponse(
                        existingCustomer.getMobileNumber(),
                        existingCustomer.getBalance()
                );

        return ResponseEntity.ok(profile);
    }
}