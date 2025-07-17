import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ExportPage from './pages/ExportPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentPage from './pages/PaymentPage';
import { PlanProvider } from './context/PlanContext';

function App() {
  return (
    <PlanProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/export/:planId" element={<ExportPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PlanProvider>
  );
}

export default App;