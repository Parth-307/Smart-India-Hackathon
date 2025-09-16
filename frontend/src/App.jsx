import { useState } from 'react'
import './App.css'
import './styles/middleSection.css'
import './styles/topSection.css'
import './styles/MessageBox.css'
import TopSection from './components/TopSection'
import MiddleSection from './components/MiddleSection'
import BottomSection from './components/BottomSection'
import SideBar from './components/SideBar'

function App() {
  const [messages, setMessages] = useState([{type:'bot', message:'Hi User', key:'message1'},
                                            {type:'bot', message:'How can i help you?', key:'message2'},
                                            {type:'user', message:'Help me find fees payment page.', key:'message3'},
                                            {type:'bot', message:'Here you go....', key:'message4'}]);
  
  return (
    <>
     <TopSection />
     <MiddleSection messages={messages}/>
     <BottomSection setMessages={setMessages} messages={messages}/>
     <SideBar />
    </>
  )
}

export default App
