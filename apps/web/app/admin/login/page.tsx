'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = 'Elijah71176';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function login() {
    if (password === ADMIN_PASSWORD) {
  localStorage.setItem('elijah-cloud-platform-admin', 'true');
  router.push("/admin/dashboard");
      //router.push('/admin/projects');
      return;
    }

    setError('Invalid password');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: 40 }}>
      <section
        style={{
          maxWidth: 420,
          margin: '80px auto',
          background: 'white',
          padding: 28,
          borderRadius: 18,
          border: '1px solid #e2e8f0',
        }}
      >
        <h1>Admin Login</h1>
        <p style={{ color: '#64748b' }}>Enter admin password to continue.</p>

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginTop: 16,
            borderRadius: 10,
            border: '1px solid #cbd5e1',
          }}
        />

        {error && <p style={{ color: 'crimson', fontWeight: 700 }}>{error}</p>}

        <button
          onClick={login}
          style={{
            marginTop: 18,
            width: '100%',
            padding: 12,
            borderRadius: 10,
            border: 0,
            background: '#2563eb',
            color: 'white',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </section>
    </main>
  );
}