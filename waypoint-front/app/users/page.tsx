"use client";

import { RightNavBar } from "@/components/rightNavBar";
import { Button } from "@/components/ui/button";
import SearchField from "@/components/ui/searchField";
import UserGrid from "@/components/ui/userGrid";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-100">
      <RightNavBar />
      <div className="flex w-full flex-col justify-start items-center text-gray-700 font-bold px-14 py-6">
          
          {/* Title */}
          <div className="w-full p-4 text-3xl text-left border-b">
            Usuários
          </div>

          {/* Filters */}
          <div className="flex w-full my-4 items-center justify-between">
            <div>
              <SearchField initialValue="Pesquisar"/>
            </div>
            {/* Add more filters */}
            <div className="flex flex-col items-center">
              <Link href={'/addUser'}>
                <Button size="lg" className="bg-orange-400 rounded-lg text-white text-lg font-semibold hover:bg-orange-500">
                  <FontAwesomeIcon icon={faPlus} /> Adicionar Usuário
                </Button>
              </Link>
            </div>
          </div>

          {/* Grid */}
          <div className="w-full">
            <UserGrid />
          </div>
      </div>
    </div>
  );
}
