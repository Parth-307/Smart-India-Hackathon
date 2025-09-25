import './App.css'
import { Link } from 'react-router-dom'
import Chatbot from './pages/Chatbot/Chatbot'

function App() {
  
  return (
    <>
      <p>Hello, this is our project</p>
      <ul>
        <li><Link to='/chatbot'>chatbot</Link></li>
        <li><Link to='/chatbot3'>Chatbot New</Link></li>
      </ul>
      <p>Hello, this is our project</p>
    </>
  )
}

export default App
