package com.savethechange.backend.service;

import com.savethechange.backend.entity.Customer;
import com.savethechange.backend.entity.Transaction;
import com.savethechange.backend.repository.CustomerRepository;
import com.savethechange.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            TransactionRepository transactionRepository) {

        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> findByMobileNumber(String mobileNumber) {
        return customerRepository.findByMobileNumber(mobileNumber);
    }

    @Transactional
    public Customer addBalance(
            String mobileNumber,
            double amount) {

        if (amount <= 0) {
            throw new RuntimeException(
                    "Amount must be greater than zero");
        }

        Optional<Customer> optionalCustomer =
                customerRepository.findByMobileNumber(mobileNumber);

        if (optionalCustomer.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        Customer customer = optionalCustomer.get();

        customer.setBalance(
                customer.getBalance() + amount);

        Customer savedCustomer =
                customerRepository.save(customer);

        Transaction transaction = new Transaction(
                mobileNumber,
                "ADD",
                amount
        );

        transactionRepository.save(transaction);

        return savedCustomer;
    }

    @Transactional
    public Customer useBalance(
            String mobileNumber,
            double amount) {

        if (amount <= 0) {
            throw new RuntimeException(
                    "Ticket amount must be greater than zero");
        }

        Optional<Customer> optionalCustomer =
                customerRepository.findByMobileNumber(mobileNumber);

        if (optionalCustomer.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        Customer customer = optionalCustomer.get();

        if (customer.getBalance() < amount) {
            throw new RuntimeException(
                    "Insufficient balance");
        }

        customer.setBalance(
                customer.getBalance() - amount);

        Customer savedCustomer =
                customerRepository.save(customer);

        Transaction transaction = new Transaction(
                mobileNumber,
                "USE",
                amount
        );

        transactionRepository.save(transaction);

        return savedCustomer;
    }

    public List<Transaction> getTransactions(
            String mobileNumber) {

        return transactionRepository
                .findByMobileNumberOrderByTimestampDesc(
                        mobileNumber);
    }

    @Transactional
    public String transferMoney(
            String senderMobile,
            String receiverMobile,
            double amount) {

        // Validate amount
        if (amount <= 0) {
            throw new RuntimeException(
                    "Transfer amount must be greater than zero");
        }

        // Sender and receiver cannot be the same
        if (senderMobile.equals(receiverMobile)) {
            throw new RuntimeException(
                    "Sender and receiver cannot be the same");
        }

        // Find sender
        Optional<Customer> senderOptional =
                customerRepository.findByMobileNumber(
                        senderMobile);

        if (senderOptional.isEmpty()) {
            throw new RuntimeException(
                    "Sender not found");
        }

        // Find receiver
        Optional<Customer> receiverOptional =
                customerRepository.findByMobileNumber(
                        receiverMobile);

        if (receiverOptional.isEmpty()) {
            throw new RuntimeException(
                    "Receiver not found");
        }

        Customer sender = senderOptional.get();
        Customer receiver = receiverOptional.get();

        // Check sender balance
        if (sender.getBalance() < amount) {
            throw new RuntimeException(
                    "Insufficient balance");
        }

        // Subtract from sender
        sender.setBalance(
                sender.getBalance() - amount);

        // Add to receiver
        receiver.setBalance(
                receiver.getBalance() + amount);

        // Save both customers
        customerRepository.save(sender);
        customerRepository.save(receiver);

        // Record sender transaction
        Transaction sentTransaction = new Transaction(
                senderMobile,
                "TRANSFER_SENT",
                amount
        );

        transactionRepository.save(sentTransaction);

        // Record receiver transaction
        Transaction receivedTransaction = new Transaction(
                receiverMobile,
                "TRANSFER_RECEIVED",
                amount
        );

        transactionRepository.save(receivedTransaction);

        return "₹" + amount +
                " transferred successfully";
    }
}