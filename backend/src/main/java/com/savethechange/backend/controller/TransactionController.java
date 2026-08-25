package com.savethechange.backend.controller;

import com.savethechange.backend.entity.Transaction;
import com.savethechange.backend.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final CustomerService customerService;

    public TransactionController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/{mobileNumber}")
    public ResponseEntity<List<Transaction>> getTransactions(
            @PathVariable String mobileNumber) {

        List<Transaction> transactions =
                customerService.getTransactions(mobileNumber);

        return ResponseEntity.ok(transactions);
    }
}