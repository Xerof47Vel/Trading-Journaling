import React from 'react'
import Navigation from '../navbar/navbar.jsx'
import Dashboard from '../Dashboard/dashboard.jsx'

const Home = () => {
  return (
    <main className="flex h-screen overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <Dashboard />
      </div>
    </main>
  );
};

export default Home;