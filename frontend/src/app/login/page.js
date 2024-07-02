"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { username, password }
      );
      if (response.status === 200) {
        // Store user data in local storage
        localStorage.setItem("user", JSON.stringify(response.data));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <div className="login-form">
        <h1 className="login-greeting">
          Hello, <br /> <span style={{ color: "#407bff" }}>Welcome back</span>
        </h1>
        <form
          onSubmit={handleLogin}
          style={{
            marginTop: "50px",
          }}
        >
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            className="username-inp"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="password-inp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div
          style={{
            marginTop: "40px",
          }}
        >
          <p className="footer-text">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="signup-link"
              style={{ textDecoration: "none" }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      <div className="image-ele">
        <Image
          src="/image.svg"
          width={800}
          height={800}
          style={{ position: "absolute", right: "40px" }}
        />
      </div>
    </div>
  );
}
