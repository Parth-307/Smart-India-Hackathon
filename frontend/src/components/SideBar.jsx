export default function SideBar({isActive}){
    const sideBarContent = 
    <div className="side-bar-inner">

    </div>;
    return (
        <div className="side-bar">
            {(isActive)?sideBarContent:""}
        </div>
    );
}