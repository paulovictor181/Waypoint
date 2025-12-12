"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Calendar, DollarSign, Loader2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <MapPin className="h-6 w-6 text-orange-500" />
      <span className="text-xl font-bold text-gray-900">Waypoint</span>
    </Link>
  );
}

type Itinerario = {
  id: number;
  name: string;
  dataInicio: string;
  dataFim: string;
  totalOrcamento: number;
  custoTotal: number;
  cidadeNome: string;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCityQuery = searchParams.get("city") || "";

  const [searchTerm, setSearchTerm] = useState(initialCityQuery);

  const [results, setResults] = useState<Itinerario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchTerm(initialCityQuery);
    if (initialCityQuery) {
      fetchResults(initialCityQuery);
    }
  }, [initialCityQuery]);

  const fetchResults = async (city: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/itinerarios/search?city=${encodeURIComponent(city)}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar itinerários:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?city=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNewSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* --- CABEÇALHO (NAVBAR EXTERNA) --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo e Botão Voltar */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <HeaderLogo />
          </div>

          {/* Barra de Busca Centralizada */}
          <div className="flex-1 max-w-xl w-full relative flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pesquisar outra cidade..."
                className="pl-10 bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 rounded-full transition-all"
              />
            </div>
            <Button
              onClick={handleNewSearch}
              className="rounded-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Buscar
            </Button>
          </div>

          {/* Botão de Login/Ação */}
          <div className="w-full md:w-auto flex justify-end">
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-gray-600 hover:text-orange-600"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {loading ? "Buscando..." : `Resultados para "${initialCityQuery}"`}
          </h1>
          <p className="text-gray-500 text-sm">
            {!loading && `${results.length} roteiro(s) encontrado(s)`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-orange-500">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <MapPin className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg">
                  Nenhum itinerário encontrado para esta cidade.
                </p>
              </div>
            ) : (
              results.map((it) => (
                <div
                  key={it.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-orange-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-orange-50 p-3 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full truncate max-w-[120px]">
                        {it.cidadeNome || initialCityQuery}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {it.name}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {it.dataInicio
                          ? new Date(it.dataInicio).toLocaleDateString()
                          : "Data indefinida"}
                        {" - "}
                        {it.dataFim
                          ? new Date(it.dataFim).toLocaleDateString()
                          : ""}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        R$ {it.totalOrcamento?.toFixed(2)}
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-800">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-orange-500" />
                          Real:
                        </span>
                        <span>R$ {it.custoTotal?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-orange-100 shadow-lg mt-4"
                    onClick={() => router.push(`/search/${it.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Carregando busca...</div>}
    >
      <SearchContent />
    </Suspense>
  );
}
