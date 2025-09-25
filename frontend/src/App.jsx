import './App.css'
import { Link } from 'react-router-dom'
import Chatbot from './pages/Chatbot/Chatbot'

function App() {
  
  return (
    <>
      <p>Hello, this is our project</p>
      <Link to='/chatbot'>chatbot</Link>
      <p>Hello, this is our project</p>
    </>
  )
}

export default App
