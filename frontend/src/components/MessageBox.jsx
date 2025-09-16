

export default function({type, message}){
    // const userMessageContent = <div className="message-box-user">{message}</div>
    // const botMessageContent = <div className="message-box-bot">{message}</div>
    return(
        <div className={"message-box-container message-box-container-"+type}>
            <div className={'message-box message-box-'+type}>
                {/* {(type === 'user')?userMessageContent:botMessageContent} */}
                <div className='message-box-inner'>{message}</div>
            </div>
        </div>
    )
}