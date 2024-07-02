// components/Layout.js
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Layout = () => {
  let [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUsername(JSON.parse(userData).username);
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="layout-container">
      <div className="main-panel">
        <div className="profile">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Avatar"
            className="avatar"
          />
          <h3>{username}</h3>
        </div>
        <div
          className="nav-panel"
          style={{
            marginTop: "30px",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
          }}
        >
          <h3>
            <a
              href="/dashboard"
              style={{
                textDecoration: "none",
                color: "grey",
              }}
            >
              Dashboard
            </a>
          </h3>
          <h3>
            <a
              href="/transaction"
              style={{
                textDecoration: "none",
                color: "grey",
              }}
            >
              Transactions
            </a>
          </h3>
          <h3>
            <a
              href="/stocks"
              style={{
                textDecoration: "none",
                color: "grey",
              }}
            >
              Stocks
            </a>
          </h3>
          <h3>
            <a
              href="/loans"
              style={{
                textDecoration: "none",
                color: "grey",
              }}
            >
              Loans
            </a>
          </h3>
        </div>
        <div className="logoutBtn">
          <a
            href="#"
            onClick={handleLogout}
            style={{
              textDecoration: "none",
              color: "black",
              position: "absolute",
              bottom: "20px",
              left: "95px",
              fontSize: "17px",
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Layout;
