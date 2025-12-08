"use client";

import { usePathname } from "next/navigation";
import { faHome, faUser, faDoorOpen, faUsers } from "@fortawesome/free-solid-svg-icons";
import NavBarBtn from "./ui/navBarBtn";
import Logo from "./ui/logo";

// Conteúdo do menu lateral (necessita verificar o tipo de acesso do user)
const NAV_ITEMS = [
    { label: "Início", icon: faHome, href: "/dashboard" },
    { label: "Usuários", icon: faUsers, href: "/users" },
];

const BOTTOM_ITEMS = [
    { label: "Perfil", icon: faUser, href: "/profile" },
    { label: "Logout", icon: faDoorOpen, href: "/login" }, // Fazer logout
];

function RightNavBar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col justify-between w-96 h-screen border-r-2 border-slate-400 p-4 bg-white">
            {/* Main Navigation */}
            <div className="flex flex-col"> 
            <Logo />
                {NAV_ITEMS.map((item) => (
                    <NavBarBtn 
                        key={item.href}
                        label={item.label} 
                        icon={item.icon} 
                        href={item.href} 
                        // Verifica se essa é a página atual
                        isActive={pathname === item.href}
                    />
                ))}
            </div>

            {/* Profile & Logout */}
            <div className="flex flex-col border-t pt-4">
                {BOTTOM_ITEMS.map((item) => (
                    <NavBarBtn 
                        key={item.href}
                        label={item.label} 
                        icon={item.icon} 
                        href={item.href} 
                        isActive={pathname === item.href}
                    />
                ))}
            </div>
            
        </nav>
    );
}

export { RightNavBar };