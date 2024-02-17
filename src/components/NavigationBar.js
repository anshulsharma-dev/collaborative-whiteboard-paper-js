import React from 'react';

function NavigationBar({ onLogout, isAuthenticated, username }) {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#2575fc",
        color: "#fff",
      }}
    >
      {isAuthenticated ? (
        <>
          <span>{`${getGreetingTime()}, ${username}`}</span>
          <button
            onClick={onLogout}
            style={{
              padding: "5px 15px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#6a11cb",
              color: "#fff",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <span>Please log in</span>
      )}
    </nav>
  );
}

export default NavigationBar;

