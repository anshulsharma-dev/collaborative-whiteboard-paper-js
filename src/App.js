import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import Whiteboard from "./pages/Whiteboard";
import NavigationBar from "./components/NavigationBar";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loginKey, setLoginKey] = useState(0);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const loginHandler = (username, password) => {
    setIsLoggedIn(true);
    setUsername(username);
    sessionStorage.setItem("username", username);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setUsername("");
    sessionStorage.removeItem("username");
    setLoginKey((prevKey) => prevKey + 1);
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <NavigationBar onLogout={logoutHandler} username={username} />
        )}
        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <LoginScreen key={loginKey} onLogin={loginHandler} />
              ) : (
                <Navigate replace to="/whiteboard" />
              )
            }
          />
          <Route
            path="/whiteboard"
            element={isLoggedIn ? <Whiteboard /> : <Navigate replace to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
