"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        { username, email, password }
      );
      if (response.status === 200) {
        // Handle successful signup
        // Redirect to login or dashboard
        router.push("/login");
      } else {
        setError("Signup failed");
      }
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div>
      <div className="login-form" style={{ width: "300px" }}>
        <h1 className="login-greeting">
          Hello, <br /> <span style={{ color: "#407bff" }}>Welcome</span>
        </h1>
        <form
          onSubmit={handleSignup}
          style={{
            marginTop: "50px",
          }}
        >
          <br />
          <input
            type="text"
            name="username"
            placeholder="Enter your name"
            className="name-inp"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            className="username-inp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Signup
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div
          style={{
            marginTop: "40px",
          }}
        >
          <p className="footer-text">
            Have an account?{" "}
            <a
              href="/login"
              className="signup-link"
              style={{ textDecoration: "none" }}
            >
              Login
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
