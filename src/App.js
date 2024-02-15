import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import Whiteboard from "./pages/Whiteboard";
import NavigationBar from "./components/NavigationBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = () => setIsLoggedIn(true);
  const logoutHandler = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <NavigationBar onLogout={logoutHandler} />}
        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <LoginScreen onLogin={loginHandler} />
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
