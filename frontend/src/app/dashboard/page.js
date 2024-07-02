"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TransactionModal from "./TransactionModal";
import AssetModal from "./AssetModal";
import StockModal from "./StockModal";
import { useRouter } from "next/navigation";
import Layout from "./navPanel";

export default function Page() {
  let [transactions, setTransactions] = useState([]);
  let [savings, setSavings] = useState(0);
  let [assets, setAssets] = useState(0);
  let [insurance, setInsurance] = useState(0);
  let [username, setUsername] = useState("John Doe");
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [isStockModalOpen, setIsStockModalOpen] = useState(false);
  let [userAssets, setUserAssets] = useState([]);
  let [monthlyIncome, setMonthlyIncome] = useState(0);
  let [monthlyExpense, setMonthlyExpense] = useState(0);
  let [stocks, setStocks] = useState([]);
  let [stockValue, setStockValue] = useState(0);
  let [selectedStock, setSelectedStock] = useState(null);

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

    userData = JSON.parse(userData);
    let username = userData.username;
    axios
      .get(`http://localhost:8080/api/dashboard/${username}`)
      .then((response) => {
        setTransactions(response.data.transactions);
        setSavings(response.data.savings);
        setAssets(response.data.assets);
        setInsurance(response.data.insurance);
        setUsername(username);
        setUserAssets(response.data.assetsList);
        setMonthlyIncome(response.data.monthlyIncome);
        setMonthlyExpense(response.data.monthlyExpense);
        let stocks = response.data.loanAmount;
        setStocks(stocks);
        let stockValue = 0;
        stocks.forEach((stock) => {
          stockValue += stock.purchasePrice * stock.quantity;
        });
        setStockValue(stockValue);
      });
  }, [router]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleAddAsset = (newAsset) => {
    setUserAssets([...userAssets, newAsset]);
  };

  const handleStockClick = async (stock) => {
    const currValue = await getStockValue(stock.symbol);
    stock.currentValue = currValue;
    stock.profitLoss =
      ((currValue - stock.purchasePrice) / stock.purchasePrice) * 100;
    setSelectedStock(stock);
  };

  const getStockValue = async (stock) => {
    let currValue = 0;
    try {
      await axios
        .get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=1NUTB823XWUSA82K`
        )
        .then((response) => {
          let d = response.data["Time Series (Daily)"];
          let lastRefreshed = response.data["Meta Data"]["3. Last Refreshed"];
          let lastClose = d[lastRefreshed]["4. close"];
          currValue = lastClose;
        });
      return currValue;
    } catch (error) {
      return "Error fetching stock value";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleAddStock = async (newStock) => {
    setSavings(savings - newStock.purchasePrice * newStock.quantity);
    setTransactions([
      ...transactions,
      {
        type: "EXPENSE",
        amount: -newStock.purchasePrice * newStock.quantity,
        date: new Date().toISOString(),
      },
    ]);
    setStocks([...stocks, newStock]);
    setStockValue(stockValue + newStock.purchasePrice * newStock.quantity);
  };

  const handleRemoveStock = async (selectedStock) => {
    const username = JSON.parse(localStorage.getItem("user")).username;

    const localDateTime = new Date();
    const year = localDateTime.getFullYear();
    const month = String(localDateTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(localDateTime.getDate()).padStart(2, "0");
    const hours = String(localDateTime.getHours()).padStart(2, "0");
    const minutes = String(localDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(localDateTime.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    let transaction = {
      amount: selectedStock.purchasePrice * selectedStock.quantity,
      date: formattedDate,
      username: username,
      type: "INCOME",
      description: `Stock Sell`,
    };
    await axios.post(`http://localhost:8080/api/transactions`, transaction);

    setTransactions([
      {
        amount: selectedStock.purchasePrice * selectedStock.quantity,
        date: formattedDate,
        username: username,
        type: "INCOME",
        description: `Stock Sell`,
      },
      ...transactions,
    ]);

    await axios.delete(`http://localhost:8080/api/stocks/remove/${username}`, {
      data: {
        symbol: selectedStock.symbol,
      },
    });

    setSavings(savings + selectedStock.purchasePrice * selectedStock.quantity);

    setStocks(stocks.filter((stock) => stock.symbol !== selectedStock.symbol));
    setStockValue(
      stockValue - selectedStock.purchasePrice * selectedStock.quantity
    );
    setSelectedStock(null);
  };

  return (
    <main>
      <h1 className="greeting">
        {" "}
        <span
          style={{
            color: "#888",
          }}
        >
          Good Day,
        </span>{" "}
        {username}{" "}
      </h1>
      <Layout />

      <div className="info-tiles">
        <div className="account-balance">
          {savings < 1000 && (
            <p
              style={{
                color: "red",
                fontSize: "15px",
                position: "absolute",
                top: "-40px",
                left: "45px",
              }}
            >
              Low Savings
            </p>
          )}

          <p>
            Savings: <br />$ {savings}
          </p>
        </div>
        <div
          className="insurance"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontSize: "19px",
              position: "relative",
              top: "-10px",
              fontWeight: "500",
            }}
          >
            Month Summary
          </p>
          <p
            style={{
              fontSize: "15px",
              margin: "0",
              position: "relative",
              top: "-20px",
            }}
          >
            Expense: $ {monthlyExpense}
          </p>
          <p
            style={{
              fontSize: "15px",
              position: "relative",
              top: "-18px",
              margin: "0",
            }}
          >
            Income: $ {monthlyIncome}
          </p>
        </div>
        <div className="assets">
          <p>
            Assets: <br />$ {assets}
          </p>
        </div>
        <div className="stocks">
          <p>
            Stocks: <br />${stockValue}
          </p>
        </div>
      </div>

      <div className="stocksView">
        <h3 style={{ fontSize: "20px" }}>Stocks</h3>
        <div className="stock-view">
          {stocks.map((stock) => (
            <div
              className="stock-unit"
              key={stock.symbol}
              onClick={() => handleStockClick(stock)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="stock-desc"
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "2px 10px 2px 10px",
                  borderRadius: "10px",
                  width: "70px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  position: "relative",
                  left: "0",
                  marginBottom: "10px",
                }}
              >
                <p>{stock.symbol}</p>
              </div>
            </div>
          ))}
          {selectedStock && stocks.length > 0 && (
            <div
              className="selectedStockDetails"
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "10px",
                width: "70%",
                height: "350px",
                margin: "20px auto",
                textAlign: "center",
                position: "absolute",
                left: "130px",
                top: "60px",
                fontSize: "18px",
              }}
            >
              <p>Symbol: {selectedStock.symbol}</p>
              <p>Purchase Price: ${selectedStock.purchasePrice}</p>
              <p>Quantity: {selectedStock.quantity}</p>
              <p>
                Current Value:{" "}
                <span
                  style={{
                    color:
                      selectedStock.currentValue > selectedStock.purchasePrice
                        ? "green"
                        : "red",
                  }}
                >
                  ${selectedStock.currentValue}
                </span>
              </p>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
                onClick={() => handleRemoveStock(selectedStock)}
              >
                Sell Stock
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsStockModalOpen(true)}
          style={{
            position: "absolute",
            left: "20px",
            bottom: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#407bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Stock
        </button>
      </div>

      <div className="transactions">
        <h3 style={{ fontSize: "20px" }}>Transactions</h3>
        <h4 className="add-transaction">
          <a
            href="#"
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => setIsModalOpen(true)}
          >
            Add Transaction
          </a>
        </h4>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          {transactions.slice(0, 13).map((transaction) => (
            <div className="transaction-unit" key={transaction.id}>
              <div className="transaction-desc">
                {transaction.amount > 0 ? (
                  <p style={{ color: "green" }}>Income: {transaction.name}</p>
                ) : (
                  <p style={{ color: "red" }}>Expense: {transaction.name}</p>
                )}
                <p className="amount">$ {transaction.amount}</p>
              </div>
              <div className="transaction-time">
                <p className="date_time">
                  {transaction.date.split("T").join(" | ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onAddStock={handleAddStock}
        savings={savings}
      />
      <div className="assets-component">
        <AssetModal onAddAsset={handleAddAsset} savings={savings} />
      </div>
    </main>
  );
}
