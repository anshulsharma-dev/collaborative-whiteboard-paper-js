import React, { useState } from "react";
import axios from "axios";

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          username,
          password,
        }
      );
      onLogin(response.data);
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: "300px",
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginScreen;
