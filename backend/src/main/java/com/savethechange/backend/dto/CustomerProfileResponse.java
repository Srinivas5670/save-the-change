package com.savethechange.backend.dto;

public class CustomerProfileResponse {

    private String mobileNumber;
    private double balance;

    public CustomerProfileResponse() {
    }

    public CustomerProfileResponse(
            String mobileNumber,
            double balance) {

        this.mobileNumber = mobileNumber;
        this.balance = balance;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}