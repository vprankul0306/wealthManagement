"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./transactionPage.css";
import Layout from "../dashboard/navPanel";
import TransactionModal from "../dashboard/TransactionModal";

const Page = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = localStorage.getItem("user");
  const parsedUserData = JSON.parse(user);
  const username = parsedUserData.username;

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [transactions, filter, selectedDate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/transactions/${username}`
      );
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]); // Set transactions to an empty array in case of error
    }
  };

  const applyFilter = () => {
    let filtered = [...transactions];
    const currentDate = new Date();

    switch (filter) {
      case "thisMonth":
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
          );
        });
        break;
      case "thisWeek":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        filtered = filtered.filter(
          (transaction) => new Date(transaction.date) >= oneWeekAgo
        );
        break;
      case "specificDate":
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date)
            .toISOString()
            .split("T")[0];
          return transactionDate === selectedDate;
        });
        break;
      case "groupByDescription":
        const grouped = Object.values(
          filtered.reduce((acc, transaction) => {
            const description = transaction.description;
            if (!acc[description]) {
              acc[description] = { description, transactions: [] };
            }
            acc[description].transactions.push(transaction);
            return acc;
          }, {})
        );
        setFilteredTransactions(grouped);
        return; // Exit early since we are setting filteredTransactions directly
      default:
        break;
    }
    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div>
      <Layout />
      <div className="container">
        <h1>Transactions</h1>
        <button
          className="add-transaction-btn"
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: "20px" }}
        >
          Add Transaction
        </button>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="thisWeek">This Week</option>
            <option value="specificDate">Specific Date</option>
            <option value="groupByDescription">Group by Description</option>
          </select>
          {filter === "specificDate" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          )}
        </div>
        <div className="transaction-list">
          {filter === "groupByDescription" ? (
            filteredTransactions.length > 0 ? (
              filteredTransactions.map((group) => (
                <div key={group.description}>
                  <h2>{group.description}</h2>
                  <table id="transactionTable">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Time</th>
                        <th>Price</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(
                        (transaction) =>
                          transaction.description === group.description && (
                            <tr key={transaction.id}>
                              <td>{transaction.type}</td>
                              <td>{transaction.description}</td>
                              <td>
                                {new Date(
                                  transaction.date
                                ).toLocaleTimeString()}
                              </td>
                              <td>{transaction.amount}</td>
                              <td>
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>No transactions found for this filter.</p>
            )
          ) : (
            <table id="transactionTable">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.type}</td>
                      <td>{transaction.description}</td>
                      <td>{new Date(transaction.date).toLocaleTimeString()}</td>
                      <td>{transaction.amount}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default Page;
