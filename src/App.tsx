import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import DirectionPage from './pages/DirectionPage/DirectionPage'
import WeatherPage from './pages/WeatherPage/WeatherPage'
import ChecklistPage from './pages/ChecklistPage/ChecklistPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignupPage from './pages/SignupPage/SignupPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/direction" element={<DirectionPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
