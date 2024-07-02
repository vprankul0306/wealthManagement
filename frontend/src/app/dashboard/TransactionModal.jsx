import React, { useState } from "react";
import axios from "axios";
import "../globals.css";

function TransactionModal({ isOpen, onClose, onAddTransaction }) {
  const [transaction, setTransaction] = useState({
    amount: "",
    type: "EXPENSE",
    date: "",
    time: "",
    username: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const username = userData.username;

    const dateTime = `${transaction.date}T${transaction.time}`;

    const amount =
      transaction.type === "EXPENSE"
        ? -Math.abs(transaction.amount)
        : Math.abs(transaction.amount);

    const description = transaction.description;

    const newTransaction = {
      ...transaction,
      username,
      date: dateTime,
      amount,
      description,
    };

    axios
      .post(`http://localhost:8080/api/transactions`, newTransaction)
      .then((response) => {
        onAddTransaction(response.data);
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={transaction.type}
              onChange={handleChange}
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="desc">Description:</label>
            <input
              type="text"
              id="desc"
              name="description"
              value={transaction.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={transaction.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={transaction.time}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="add-btn">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
