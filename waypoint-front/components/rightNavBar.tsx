import { faHome, faUser } from "@fortawesome/free-regular-svg-icons";
import NavBarBtn from "./ui/navBarBtn";
import { faDoorOpen, faUsers } from "@fortawesome/free-solid-svg-icons";


function RightNavBar() {
    return (
        <div className="flex flex-col justify-between w-96 h-screen border-r-2 border-slate-400 p-6">
            {/* Nav */}
            <div> 
                <NavBarBtn label="Início" icon={faHome} selected={true}/>
                <NavBarBtn label="Usuários" icon={faUsers} selected={false}/>
            </div>
            {/* Profile e Logoff */}
            <div>
                <NavBarBtn style="text-center" label="Perfil" icon={faUser} selected={false}/>
                <NavBarBtn label="Logout" icon={faDoorOpen} selected={false}/>
            </div>
            
        </div>
    );
}''

export {RightNavBar};