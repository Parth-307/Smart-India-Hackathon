import './App.css'
import { Routes, Route } from 'react-router-dom'
import Chatbot from './pages/Chatbot/Chatbot.jsx'
import ChatBot3 from './pages/ChatbotNew/Chatbot3.jsx'
import Homepage from './pages/homepage/Homepage'

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={ <Homepage /> } />
        <Route path='/chatbot' element={ <Chatbot /> } />
        <Route path='/chatbot3' element={ <ChatBot3 /> } />
        
      </Routes>
    </>
  )
}

export default App
