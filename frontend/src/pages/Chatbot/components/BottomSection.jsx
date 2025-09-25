
import SearchBar from "./Searchbar";

export default function({messages, setMessages}) {
    // const [lines, setLines] = useState(document.querySelector('.search-bar-input').value.split("\n").length);

    return(
        <div className="bottom-section">
            <div className="bottom-section-inner">
                <SearchBar messages={messages} setMessages={setMessages}/>
            </div>
        </div>
    );
}