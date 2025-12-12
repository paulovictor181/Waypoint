// waypoint-front/components/rightNavBar.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import {
  faDoorOpen,
  faHome,
  faSuitcase,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Logo from "./ui/logo";
import NavBarBtn from "./ui/navBarBtn";

// Estrutura do item de navegação com a propriedade 'roles'
const NAV_ITEMS = [
  { label: "Início", icon: faHome, href: "/dashboard", roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_PREMIUM"] }, 
  { label: "Usuários", icon: faUsers, href: "/users", roles: ["ROLE_ADMIN"] }, // Apenas ADMIN
  { label: "Itinerários", icon: faSuitcase, href: "/itinerary", roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_PREMIUM"] },
];

const BOTTOM_ITEMS = [
  { label: "Perfil", icon: faUser, href: "/profile" },
  { label: "Logout", icon: faDoorOpen, href: "/login" }, // Fazer logout
];

function RightNavBar() {
  const pathname = usePathname();
  
  const { logout, userRole } = useAuth(); 

  // Filtra itens de navegação baseados na role do usuário
  const filteredNavItems = NAV_ITEMS.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <nav className="flex flex-col justify-between w-96 h-screen border-r-2 border-slate-400 p-4 bg-white">
      {/* Main Navigation */}
      <div className="flex flex-col">
        <Logo />
        {/* Usando a lista filtrada */}
        {filteredNavItems.map((item) => (
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
            key={item.label}
            label={item.label}
            icon={item.icon}
            href={item.href}
            isActive={pathname === item.href}
            onClick={
              item.label === "Logout"
                ? (e) => {
                    e.preventDefault();
                    logout();
                  }
                : undefined
            }
          />
        ))}
      </div>
    </nav>
  );
}

export { RightNavBar };