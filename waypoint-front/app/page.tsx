import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react"; // Ícones

// Componente para o seu Logo
function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Usando a cor padrão 'orange-500' */}
      <MapPin className="h-8 w-8 text-orange-500" />
      <span className="text-2xl font-bold text-gray-100">Waypoint</span>
    </div>
  );
}

// A página principal
export default function OnboardingPage() {
  return (
    // Wrapper principal com fundo escuro
    <div className="min-h-screen w-full text-gray-100">
      {/* 1. Cabeçalho */}
      <header className="container mx-auto max-w-6xl p-4 md:p-6">
        <nav className="flex items-center justify-between">
          <Logo />
          <Button
            size="lg"
            // Usando a cor padrão 'orange-500'
            className="bg-orange-500 text-white font-semibold hover:bg-orange-500/90"
          >
            Fazer Login
          </Button>
        </nav>
      </header>

      {/* 2. Conteúdo Principal */}
      <main className="container mx-auto max-w-6xl p-4 md:p-8 flex flex-col items-center">
        {/* Título */}
        <h1 className="text-4xl md:text-6xl font-bold mt-20 md:mt-32 text-center">
          Aonde você quer ir?
        </h1>

        {/* Barra de Busca */}
        <div className="mt-10 w-full max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Procure destinos e roteiros..."
            className="w-full h-14 pl-12 pr-32 rounded-full text-lg 
                       bg-gray-100 text-gray-900 
                       placeholder:text-gray-500 border-0 
                       focus-visible:ring-orange-500" // Usando a cor padrão 'orange-500'
          />
          <Button
            size="lg"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full 
                       bg-orange-500 text-white font-semibold hover:bg-orange-500/90" // Usando a cor padrão 'orange-500'
          >
            Buscar
          </Button>
        </div>

        {/* 3. Banner Laranja */}
        <div
          className="mt-16 w-full max-w-5xl rounded-2xl bg-orange-500 p-8 md:p-12 // Usando a cor padrão 'orange-500'
                     flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Lado do Texto */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Seu próximo destino começa aqui.
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Monte seus roteiros, descubra planos prontos e viva experiências
              inesquecíveis.
            </p>
          </div>

          {/* Lado do Mapa (Placeholder) */}
          <div className="md:w-1/2 h-56 w-full bg-white/30 rounded-lg flex items-center justify-center">
            <span className="text-white/70">[Imagem do Mapa aqui]</span>
          </div>
        </div>
      </main>
    </div>
  );
}
