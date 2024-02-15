function NavigationBar({ onLogout }) {
  return (
    <nav>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default NavigationBar;
