import InputActionBtn from './InputActionBtn';
import { useRef, useState } from 'react';

export default function SearchBar({ messages, setMessages }) {
  const textbox = useRef(null);
  const [lines, setLines] = useState(0);

  function handleInput() {
    setLines(
      Math.ceil((textbox.current.value.length*10)/textbox.current.offsetWidth)
    );
  }

  async function handleSendBtnClick() {
    const userMessage = textbox.current.value;
    if (!userMessage.trim()) {
        return;
    }
    const newMessages = [...messages, { type: 'user', message: userMessage }];
    setMessages(newMessages);
    textbox.current.value = '';
    handleInput();

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...newMessages,
          { type: 'bot', message: data.response },
        ]);
      } else {
        console.error('Error from server:', response.statusText);
        setMessages([
          ...newMessages,
          { type: 'bot', message: 'Some random EROOR LOOL!' },
        ]);
      }
    } catch (error) {
      console.error('Failed to connect to the server:', error);
      setMessages([
        ...newMessages,
        { type: 'bot', message: 'Failed to connect to the server' },
      ]);
    }
  }

   return(
        <div className="search-bar-div">
            <textarea className="search-bar-input" ref={textbox} onInput={handleInput} placeholder='Ask me anything' style={{height: (lines+1)*1.5+'rem',}}>
            </textarea>
            <div className='action-btn-container'>
                <InputActionBtn onClick = {()=>{handleSendBtnClick(); handleInput();}} id='chatbot-enter-btn' content={<span className="material-symbols-outlined">arrow_upward</span>}/>
                <InputActionBtn id='chatbot-voice-input-btn' content={<span className="material-symbols-outlined">mic</span>}/>
            </div>
        </div>
    )
}