"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import StockModal from "../dashboard/StockModal";
import "./stocks.css";
import Layout from "../dashboard/navPanel";
import { useRouter } from "next/navigation";

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [stockValue, setStockValue] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);

  const router = useRouter();

  useEffect(() => {
    let userData = localStorage.getItem("user");

    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUserData = JSON.parse(userData);
    if (!parsedUserData || !parsedUserData.username) {
      router.push("/login");
      return;
    }

    const username = parsedUserData.username;
    axios
      .get(`http://localhost:8080/api/stocks/${username}`)
      .then((response) => {
        const stocks = response.data;
        setStocks(stocks);
        let stockValue = 0;
        stocks.forEach((stock) => {
          stockValue += stock.purchasePrice * stock.quantity;
        });
        setStockValue(stockValue);
      });
  }, [router]);

  const handleStockClick = async (stock) => {
    const currValue = await getStockValue(stock.symbol);
    const history = await getStockHistory(stock.symbol);
    setSelectedStock({ ...stock, currentValue: currValue });
    setStockHistory(history);
  };

  const getStockValue = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=1NUTB823XWUSA82K`
      );
      const data = response.data["Time Series (Daily)"];
      const lastRefreshed = response.data["Meta Data"]["3. Last Refreshed"];
      const lastClose = data[lastRefreshed]["4. close"];
      return lastClose;
    } catch (error) {
      console.error("Error fetching stock value:", error);
      return "Error fetching stock value";
    }
  };

  const getStockHistory = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=1NUTB823XWUSA82K`
      );
      const data = response.data["Time Series (Daily)"];
      const dates = Object.keys(data);
      const closingPrices = dates.map((date) => data[date]["4. close"]);
      return { dates, closingPrices };
    } catch (error) {
      console.error("Error fetching stock history:", error);
      return { dates: [], closingPrices: [] };
    }
  };

  const handleAddStock = (newStock) => {
    setStocks([...stocks, newStock]);
    setStockValue(stockValue + newStock.purchasePrice * newStock.quantity);
  };

  const handleRemoveStock = async (selectedStock) => {
    const username = JSON.parse(localStorage.getItem("user")).username;
    await axios.delete(`http://localhost:8080/api/stocks/remove/${username}`, {
      data: {
        symbol: selectedStock.symbol,
      },
    });
    setStocks(stocks.filter((stock) => stock.symbol !== selectedStock.symbol));
    setStockValue(
      stockValue - selectedStock.purchasePrice * selectedStock.quantity
    );
    setSelectedStock(null);
  };

  return (
    <div>
      <Layout />
      <div className="stocks-container">
        <h1 className="stocks-title">Stocks</h1>
        <div className="stocks-summary">
          <p>Total Stock Value: ${stockValue}</p>
        </div>
        <div className="stocks-list">
          {stocks.map((stock) => (
            <div
              className="stock-item"
              key={stock.symbol}
              onClick={() => handleStockClick(stock)}
            >
              <p>{stock.symbol}</p>
            </div>
          ))}
        </div>
        {selectedStock && (
          <div
            className="stock-details"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                position: "relative",
              }}
            >
              <div>
                <p>
                  <span style={{ fontWeight: "bold" }}>Symbol:</span>{" "}
                  {selectedStock.symbol}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Purchase Price:</span>$
                  {selectedStock.purchasePrice}
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontWeight: "bold" }}>Quantity:</span>{" "}
                  {selectedStock.quantity}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Current Value:</span>$
                  {selectedStock.currentValue}
                </p>
              </div>
            </div>
            <button
              className="remove-stock-btn"
              onClick={() => handleRemoveStock(selectedStock)}
              style={{ position: "absolute", left: "150px", top: "580px" }}
            >
              Remove Stock
            </button>
            <div className="stock-graph">
              <Plot
                data={[
                  {
                    x: stockHistory.dates,
                    y: stockHistory.closingPrices,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "blue" },
                  },
                ]}
                layout={{
                  title: `${selectedStock.symbol} Stock Price`,
                  xaxis: { title: "Date" },
                  yaxis: { title: "Closing Price (USD)" },
                  autosize: true,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}
        <button
          className="add-stock-btn"
          onClick={() => setIsStockModalOpen(true)}
        >
          Add Stock
        </button>
        <StockModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          onAddStock={handleAddStock}
        />
      </div>
    </div>
  );
}
