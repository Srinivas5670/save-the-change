package com.savethechange.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class TransferRequest {

    @NotBlank(message = "Sender mobile number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Sender mobile number must contain exactly 10 digits"
    )
    private String senderMobile;

    @NotBlank(message = "Receiver mobile number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Receiver mobile number must contain exactly 10 digits"
    )
    private String receiverMobile;

    @NotNull(message = "Transfer amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Transfer amount must be greater than zero"
    )
    private Double amount;

    public TransferRequest() {
    }

    public String getSenderMobile() {
        return senderMobile;
    }

    public void setSenderMobile(String senderMobile) {
        this.senderMobile = senderMobile;
    }

    public String getReceiverMobile() {
        return receiverMobile;
    }

    public void setReceiverMobile(String receiverMobile) {
        this.receiverMobile = receiverMobile;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}