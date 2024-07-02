"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./loan.css";
import Layout from "../dashboard/navPanel";
import LoanModal from "./LoanModal"; // Make sure the path is correct

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = localStorage.getItem("user");
  const parsedUserData = JSON.parse(user);
  const username = parsedUserData.username;

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/loans/${username}`
      ); // replace with actual username
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const handleAddLoan = async (loan) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/loans",
        loan
      );
      setLoans([...loans, response.data]);
    } catch (error) {
      console.error("Error adding loan:", error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    try {
      await axios.delete(`http://localhost:8080/api/loans/${loanId}`);
      setLoans(loans.filter((loan) => loan.id !== loanId));
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  const handleEmiPayment = async (loan) => {
    try {
      if (loan.emiStatus == true) {
        alert("EMI already paid");
        return;
      }
      const obj = {
        amount: loan.amount,
        description: loan.description,
        emiAmount: loan.emiAmount,
        emiStatus: loan.emiStatus,
        endDate: loan.endDate,
        id: loan.id,
        interestRate: loan.interestRate,
        paidAmount: loan.paidAmount,
        startDate: loan.startDate,
        username: loan.username,
      };
      await axios.post(`http://localhost:8080/api/loans/paymentDone`, obj);
      fetchLoans();

      const localDateTime = new Date();
      const year = localDateTime.getFullYear();
      const month = String(localDateTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(localDateTime.getDate()).padStart(2, "0");
      const hours = String(localDateTime.getHours()).padStart(2, "0");
      const minutes = String(localDateTime.getMinutes()).padStart(2, "0");
      const seconds = String(localDateTime.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      let transaction = {
        amount: -loan.emiAmount,
        date: formattedDate,
        username: loan.username,
        type: "EXPENSE",
        description: `Loan EMI Payment`,
      };
      await axios
        .post(`http://localhost:8080/api/transactions`, transaction)
        .then((response) => {});
    } catch (error) {
      console.error("Error making EMI payment:", error);
    }
  };

  return (
    <div>
      <Layout />
      <div className="loans-page">
        <h1 className="page-title">Loans</h1>
        <button onClick={() => setIsModalOpen(true)} className="open-modal-btn">
          Add Loan
        </button>
        <LoanModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddLoan={handleAddLoan}
        />
        <div className="loan-list">
          <h2>Your Loans</h2>
          <ul>
            {loans.map((loan) => (
              <li key={loan.id} className="loan-item">
                <div className="loan-details">
                  <span style={{ fontWeight: "bold" }}>{loan.description}</span>
                  , Amount: {loan.amount}, Interest Rate: {loan.interestRate}
                  <br /> Start Date: {loan.startDate}, End Date: {loan.endDate}
                  <br />
                  EMI Amount: {loan.emiAmount}, Status:{" "}
                  {loan.emiPaid == true ? "Paid" : "Unpaid"}, Paid Amount:{" "}
                  {loan.paidAmount}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                  }}
                >
                  <button
                    onClick={() => handleEmiPayment(loan)}
                    className="emi-btn"
                  >
                    Pay EMI
                  </button>
                  <button
                    onClick={() => handleDeleteLoan(loan.id)}
                    className="delete-loan-btn"
                  >
                    Delete Loan
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
