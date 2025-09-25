import MessageBox from "./MessageBox";
import { useEffect, useRef } from "react";

export default function({messages}) {
    const container = useRef(null);
    useEffect(()=>{
        container.current.scrollBottom;
    }, [messages])
    return(
        <div className="middle-section">
            <div className="middle-section-inner" ref={container}>
                {messages.slice().reverse().map((msg, index)=>{
                    return <MessageBox type={msg.type} key={'message'+index} message={msg.message} />
                })}
            </div>
        </div>
    )
}