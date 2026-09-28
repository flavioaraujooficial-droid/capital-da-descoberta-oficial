import { useState, useMemo } from 'react';
import { X, MapPin, User, Instagram, Music } from 'lucide-react';
import type { Territory } from '../data/territories';

export type VoterInfo = {
  name: string;
  city: string;
  instagram: string;
};

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (info: VoterInfo) => void;
  selectedLabel: string;
  territory: Territory;
};

// Lista oficial com os 417 municípios do Estado da Bahia para busca inteligente
const BAHIA_CITIES = [
  "Abaíra", "Abaré", "Acajutiba", "Adustina", "Água Fria", "Aiquara", "Alagoinhas", "Alcobaça", "Almadina", "Amargosa",
  "Amélia Rodrigues", "América Dourada", "Anagé", "Andaraí", "Andorinha", "Angical", "Anguera", "Antas", "Antônio Cardoso", "Antônio Gonçalves",
  "Aporá", "Apuarema", "Araçás", "Aracatu", "Araci", "Aramari", "Arataca", "Aratuípe", "Itabela", "Itaberaba",
  "Itabuna", "Itacaré", "Itaeté", "Itagi", "Itagibá", "Itagimirim", "Itaguaçu da Bahia", "Itaju do Colônia", "Itajuípe", "Itamaraju",
  "Itamari", "Itambé", "Itanagra", "Itanhém", "Itaparica", "Itapé", "Itapebi", "Itapetinga", "Itapicuru", "Itapitanga",
  "Itaquara", "Itarantim", "Itatim", "Itiruçu", "Itiúba", "Itororó", "Ituaçu", "Ituberá", "Iuiú", "Jaborandi",
  "Jacaraci", "Jacobina", "Jaguaquara", "Jaguarari", "Jaguaripe", "Jandaíra", "Jequié", "Jeremoabo", "Jiquiriçá", "Jitaúna",
  "João Dourado", "Jucuruçu", "Jussara", "Jussari", "Jussiape", "Lafaiete Coutinho", "Lagoa Real", "Laje", "Lajedão", "Lajedinho",
  "Lajedo do Tabocal", "Lamarão", "Lapão", "Lauro de Freitas", "Lençóis", "Licínio de Almeida", "Lamarão", "Luís Eduardo Magalhães", "Macajuba", "Macarani",
  "Macaúbas", "Macururé", "Madre de Deus", "Maetinga", "Maiquinique", "Mairi", "Malhada", "Malhada de Pedras", "Manoel Vitorino", "Mansidão",
  "Maragogipe", "Maraú", "Marcionílio Souza", "Mascote", "Massaroca", "Mata de São João", "Matina", "Medeiros Neto", "Miguel Calmon", "Milagres",
  "Mirangaba", "Mirante", "Monte Santo", "Morpará", "Morro do Chapéu", "Mulungu do Morro", "Mundo Novo", "Muniz Ferreira", "Muquém de São Francisco", "Muritiba",
  "Mutuípe", "Nazaré", "Nilo Peçanha", "Nordestina", "Nova Itarana", "Nova Redenção", "Nova Soure", "Nova Vicitória", "Novo Horizonte", "Novo Triunfo",
  "Olindina", "Oliveira dos Brejinhos", "Ouriçangas", "Ourolândia", "Palmas de Monte Alto", "Palmeiras", "Paramirim", "Paratinga", "Paripiranga", "Pau Brasil",
  "Paulo Afonso", "Pé de Serra", "Pedrão", "Pedro Alexandre", "Piatã", "Pilão Arcado", "Pindaí", "Pindobaçu", "Pintadas", "Piraí do Norte",
  "Piripá", "Piritiba", "Planaltino", "Planalto", "Poções", "Pojuca", "Ponto Novo", "Porto Seguro", "Potiraguá", "Prado",
  "Presidente Dutra", "Presidente Jânio Quadros", "Presidente Tancredo Neves", "Queimadas", "Quijingue", "Quixabeira", "Rau", "Remanso", "Retirolândia", "Riachão das Neves",
  "Riachão do Jacuípe", "Riacho de Santana", "Ribeira do Amparo", "Ribeira do Pombal", "Ribeirão do Largo", "Rio de Contas", "Rio do Antônio", "Rio do Pires", "Rio Real", "Rodelas",
  "Ruy Barbosa", "Salinas da Margarida", "Salvador", "Santa Bárbara", "Santa Brígida", "Santa Cruz Cabrália", "Santa Cruz da Vitória", "Santa Inês", "Santaluz", "Santa Luzia",
  "Santa Maria da Vitória", "Santana", "Santanópolis", "Santa Rita de Cássia", "Santa Teresinha", "Santo Amaro", "Santo Antônio de Jesus", "Santo Estêvão", "São Desidério", "São Domingos",
  "São Felipe", "São Félix", "São Félix do Coribe", "São Francisco do Conde", "São Gabriel", "São Gonçalo dos Campos", "São José da Vitória", "São José do Jacuípe", "São Miguel das Matas", "São Sebastião do Passé",
  "Sapeaçu", "Sátiro Dias", "Saubara", "Saúde", "Seabra", "Sebastião Laranjeiras", "Senhor do Bonfim", "Sento Sé", "Serra do Ramalho", "Serra Dourada",
  "Serra Preta", "Serrinha", "Serrolândia", "Simões Filho", "Sítio do Mato", "Sítio do Quinto", "Sobradinho", "Souto Soares", "Tabocas do Brejo Velho", "Tanhaçu",
  "Tanquednovo", "Tanque Novo", "Tarandai", "Teodoro Sampaio", "Teofilândia", "Teolândia", "Fátima", "Feira de Santana", "Feira da Mata", "Fronteira",
  "Fátima", "Barra", "Barra da Estiva", "Barra do Choça", "Barra do Mendes", "Barra do Rocha", "Barreiras", "Barro Alto", "Barro Preto", "Barrocas",
  "Belmonte", "Belo Campo", "Biritinga", "Boa Nova", "Boa Vista do Tupim", "Bom Jesus da Lapa", "Bom Jesus da Serra", "Boninal", "Bonito", "Boquira",
  "Botuporã", "Brejões", "Brejolândia", "Brumado", "Buerarema", "Buritirama", "Caatiba", "Cabaceiras do Paraguaçu", "Cachoeira", "Caculé",
  "Caém", "Caetanos", "Caetité", "Cafarnaum", "Cairu", "Caldeirão Grande", "Camacan", "Camaçari", "Camamu", "Campo Alegre de Lourdes",
  "Campo Formoso", "Canápolis", "Canarana", "Canavieiras", "Cansanção", "Canudos", "Capela do Alto Alegre", "Capim Grosso", "Caraíbas", "Caravelas",
  "Cardeal da Silva", "Carinhanha", "Casa Nova", "Castro Alves", "Catolândia", "Catu", "Caturama", "Central", "Chorrochó", "Cícero Dantas",
  "Cipó", "Coaraci", "Cocos", "Conceição da Feira", "Conceição do Almeida", "Conceição do Coité", "Conceição do Jacuípe", "Conde", "Condeúba", "Contendas do Sincorá",
  "Coração de Maria", "Cordeiros", "Coribe", "Coronel João Sá", "Correntina", "Cotegipe", "Cravolândia", "Crisópolis", "Cristópolis", "Cruz das Almas",
  "Curaçá", "Dário Meira", "Dias d'Ávila", "Dário Meira", "Dom Basílio", "Dom Macedo Costa", "Elísio Medrado", "Encruzilhada", "Entre Rios", "Esplanada",
  "Euclides da Cunha", "Eunápolis", "Exu", "Fátima", "Feira da Mata", "Feira de Santana", "Filadélfia", "Firmino Alves", "Floresta Azul", "Formosa do Rio Preto",
  "Gandu", "Gavião", "Gentio do Ouro", "Glória", "Gongogi", "Governador Mangabeira", "Guajeru", "Guanambi", "Guaratinga", "Heliópolis",
  "Iaçu", "Ibiassucê", "Ibicaraí", "Ibicoara", "Ibicuí", "Ibipeba", "Ibipitanga", "Ibiquera", "Ibirapitanga", "Ibirapuã",
  "Ibirapitanga", "Ibirataia", "Ibitiara", "Ibititá", "Ibotirama", "Ichu", "Igaporé", Igrapiúna, "Iguaí", "Ilhéus",
  "Inhambupe", "Ipecaetá", "Ipiaú", "Ipirá", "Ipupiara", "Irajuba", "Iramaia", "Iraquara", "Irará", "Irecê",
  "Itagi", "Valença", "Valente", "Várzea da Roça", "Várzea do Poço", "Várzea Nova", "Varzedo", "Vera Cruz", "Vereda", "Vitória da Conquista",
  "Wagner", "Wanderley", "Wenceslau Guimarães", "Xique-Xique"
];

export function LoginModal({ open, onClose, onConfirm, selectedLabel, territory }: LoginModalProps) {
  const [name, setName] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [instagram, setInstagram] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtra as cidades dinamicamente conforme o usuário digita
  const filteredCities = useMemo(() => {
    if (!cityInput.trim()) return [];
    const search = cityInput.toLowerCase();
    return BAHIA_CITIES.filter(c => c.toLowerCase().includes(search)).slice(0, 8);
  }, [cityInput]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cityInput.trim()) return;
    onConfirm({
      name: name.trim(),
      city: cityInput.trim(),
      instagram: instagram.trim().replace('@', ''),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0b1329] border border-[#dc2626]/30 p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Confirme seu Voto</h3>
            <p className="text-xs text-gray-400 truncate max-w-[260px]">{selectedLabel}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Seu Nome *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria da Bahia"
                className="w-full rounded-xl bg-[#06101E] border border-gray-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#dc2626] focus:outline-none"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-300 mb-1">Sua Cidade na Bahia *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Digite sua cidade (ex: Catu, Salvador...)"
                className="w-full rounded-xl bg-[#06101E] border border-gray-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#dc2626] focus:outline-none"
              />
            </div>

            {/* Sugestões de Autocomplete */}
            {showDropdown && filteredCities.length > 0 && (
              <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl bg-[#06101E] border border-gray-700 shadow-xl">
                {filteredCities.map((cidade) => (
                  <li
                    key={cidade}
                    onClick={() => {
                      setCityInput(cidade);
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer px-4 py-2.5 text-sm text-gray-200 hover:bg-[#dc2626]/20 hover:text-white transition-colors border-b border-gray-800/50 last:border-none"
                  >
                    {cidade}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Instagram (Opcional)</label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seu.instagram"
                className="w-full rounded-xl bg-[#06101E] border border-gray-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#dc2626] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all"
            >
              Confirmar Voto e Gerar Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
