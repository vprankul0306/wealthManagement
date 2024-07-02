import { useState } from "react";
import axios from "axios";
import "./StockModal.css";

export default function StockModal({ isOpen, onClose, onAddStock, savings }) {
  const [symbol, setSymbol] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleAddStock = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const username = userData.username;

    if (purchasePrice * quantity > savings) {
      alert("You don't have enough savings to buy this stock");
      return;
    }

    const newStock = {
      symbol,
      purchasePrice,
      quantity,
      username,
    };
    await axios
      .post(`http://localhost:8080/api/stocks/${username}`, newStock)
      .then((response) => {
        onAddStock(response.data);
        onClose();
      });

    const localDateTime = new Date();
    const year = localDateTime.getFullYear();
    const month = String(localDateTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(localDateTime.getDate()).padStart(2, "0");
    const hours = String(localDateTime.getHours()).padStart(2, "0");
    const minutes = String(localDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(localDateTime.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    let transaction = {
      amount: -newStock.purchasePrice * newStock.quantity,
      date: formattedDate,
      username: username,
      type: "EXPENSE",
      description: `Stock Purchase`,
    };
    await axios
      .post(`http://localhost:8080/api/transactions`, transaction)
      .then((response) => {});
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Add Stock</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Symbol:
            <br />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </label>
          <label>
            Purchase Price:
            <br />
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </label>
          <label>
            Quantity:
            <br />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>
          <button type="button" onClick={handleAddStock}>
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
}
