import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MarketplacePage  from './components/screens/MarketPlacePage'
import ChartingAIDashboardPage from "./components/screens/ChartingAIDashboardPage";
import { SuccessPage } from './components/screens/SuccessPage'
import { ProfilePage } from './components/screens/ProfilePage'
import './globals.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/success" replace />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/charting-ai-dashboard" element={<ChartingAIDashboardPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
