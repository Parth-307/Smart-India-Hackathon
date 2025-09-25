export default function InputActionBtn(props){

    return(
        <div className="input-action-btn-div">
            <button className="input-action-btn" onClick={props.onClick} id={props.id}>{props.content}</button>
        </div>
    );
}