import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Chatbot from './pages/Chatbot/Chatbot.jsx'
import ChatBot3 from './pages/ChatbotNew/Chatbot3.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='/chatbot' element={ <Chatbot /> } />
        <Route path='/chatbot3' element={ <ChatBot3 /> } />
      </Routes>
    </BrowserRouter>

    {/* <App /> */}
  </StrictMode>
)
