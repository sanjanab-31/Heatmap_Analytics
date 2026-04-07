function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: '#e0e0e0',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.4rem',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}
      >
        Heatmap Dashboard
      </h1>
      <p style={{ opacity: 0.6, fontSize: '1rem' }}>
        Phase 1 — scaffold loaded successfully.
      </p>
    </div>
  );
}

export default App;
