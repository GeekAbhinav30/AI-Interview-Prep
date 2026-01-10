import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import InterviewPage from "./pages/InterviewPage";
import PricingPage from './pages/pricing';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start-practicing" element={<InterviewPage onBack={() => window.history.back()} />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Router>
  );
};

export default App;