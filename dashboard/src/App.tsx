import React, { useState } from 'react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ padding: 8 }}>Login</button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}

function DashboardPlaceholder() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Welcome, admin! (CRUD UI coming next)</p>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('dashboard_logged_in') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('dashboard_logged_in', 'true');
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <DashboardPlaceholder />;
}

export default App;
