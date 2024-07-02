import React, { useState, useEffect } from "react";
import axios from "axios";

function AssetModal({ savings }) {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: "",
    value: "",
    username: "",
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.username) {
          window.location.href = "/login";
          return;
        }
        const username = userData.username;

        setNewAsset((prevState) => ({
          ...prevState,
          username,
        }));

        const response = await axios.get(
          `http://localhost:8080/api/assets/${username}`
        );
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("user"));
    const username = userData.username;

    if (newAsset.value > savings) {
      alert("You don't have enough savings to buy this asset");
      return;
    }

    const localDateTime = new Date();
    const year = localDateTime.getFullYear();
    const month = String(localDateTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(localDateTime.getDate()).padStart(2, "0");
    const hours = String(localDateTime.getHours()).padStart(2, "0");
    const minutes = String(localDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(localDateTime.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    let transaction = {
      amount: -newAsset.value,
      date: formattedDate,
      username: username,
      type: "EXPENSE",
      description: `Asset Purchase`,
    };
    await axios
      .post(`http://localhost:8080/api/transactions`, transaction)
      .then((response) => {});

    axios
      .post(`http://localhost:8080/api/assets/${username}`, newAsset)
      .then((response) => {
        setAssets([...assets, response.data]);
        setNewAsset({ name: "", value: "", username: "" });
      });
  };

  const handleDelete = async (asset) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const username = userData.username;

      const localDateTime = new Date();
      const year = localDateTime.getFullYear();
      const month = String(localDateTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(localDateTime.getDate()).padStart(2, "0");
      const hours = String(localDateTime.getHours()).padStart(2, "0");
      const minutes = String(localDateTime.getMinutes()).padStart(2, "0");
      const seconds = String(localDateTime.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      let transaction = {
        amount: asset.value,
        date: formattedDate,
        username: username,
        type: "INCOME",
        description: `Asset Sell`,
      };
      await axios
        .post(`http://localhost:8080/api/transactions`, transaction)
        .then((response) => {});

      await axios
        .delete(`http://localhost:8080/api/assets/delete/${username}`, {
          data: { name: asset.name },
        })
        .then((response) => {
          setAssets(assets.filter((a) => a.name !== asset.name));
          console.log(response);
        });
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <div className="assetModal">
      <div className="assetModal-content">
        <h2>Manage Assets</h2>
        <div className="assetList-container">
          <ul className="assetList">
            {assets.map((asset) => (
              <li key={asset.id} className="assetItem">
                {asset.name} - ${asset.value}
                <button
                  className="removeAssetBtn"
                  onClick={() => handleDelete(asset)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="assetInput-form">
          <label>
            Asset Name:
            <br />
            <input
              type="text"
              name="name"
              value={newAsset.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Value:
            <br />
            <input
              type="number"
              name="value"
              value={newAsset.value}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <button type="submit" className="addAssetBtn">
            Add Asset
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssetModal;
