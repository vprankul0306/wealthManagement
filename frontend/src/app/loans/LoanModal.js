"use client";

import React, { useState } from "react";
import "./LoanModal.css";

const LoanModal = ({ isOpen, onClose, onAddLoan }) => {
  const [amount, setAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emiAmount, setEmiAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

  const user = localStorage.getItem("user");
  const parsedUserData = JSON.parse(user);
  const username = parsedUserData.username;

  if (!isOpen) return null;

  const handleAddLoan = () => {
    onAddLoan({
      username,
      description,
      amount,
      interestRate,
      startDate,
      endDate,
      emiAmount,
      paidAmount,
    });
    setAmount("");
    setInterestRate("");
    setStartDate("");
    setEndDate("");
    setEmiAmount("");
    setDescription("");
    setPaidAmount("");
    onClose(); // Close the modal after adding the loan
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Loan</h2>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Interest Rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="form-input"
        />
        <br />
        <label>Start Date:</label>
        <br />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-input"
        />
        <br />
        <label>End Date:</label>
        <br />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="EMI Amount"
          value={emiAmount}
          onChange={(e) => setEmiAmount(e.target.value)}
          className="form-input"
        />
        <button onClick={handleAddLoan} className="add-loan-btn">
          Add Loan
        </button>
      </div>
    </div>
  );
};

export default LoanModal;
