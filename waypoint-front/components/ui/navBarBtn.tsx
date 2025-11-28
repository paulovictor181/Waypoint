import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, IconDefinition } from '@fortawesome/free-solid-svg-icons'; 

interface NavBarBtnProps{
    style?: String;
    label: String;
    icon: IconDefinition;
    selected: boolean;
}

const NavBarBtn = ({style, label, selected, icon } : NavBarBtnProps) => {

    const bg = selected ? "bg-orange-400" : "text-black"; 
    const bgHover = selected ? "hover:bg-orange-500" : "text-black hover:bg-gray-100";
    const iconBtn = icon; 

    return(
        <button className={`flex justify-start items-center w-full h-10 my-4 ${bg} ${bgHover} transition duration-200 rounded-lg ${style}`}>
            <div className='w-6 mx-4'>
                <FontAwesomeIcon icon={iconBtn} />
            </div>
            <div>
                {label}
            </div>
        </button>
    );
} 

export default NavBarBtn;