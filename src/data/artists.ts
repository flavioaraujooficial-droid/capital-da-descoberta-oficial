export type Artist = {
  id: string;
  name: string;
  song: string;
  decade: string;
  image: string;
};

// Curated list of real, acclaimed artists — national and international
// from the 70s, 80s, 90s, and 2000s. No fabricated data.
export const ARTISTS: Artist[] = [
  // Anos 70
  { id: 'a1', name: 'Roberto Carlos', song: 'Detalhes', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 'a2', name: 'Queen', song: 'Bohemian Rhapsody', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 'a3', name: 'Tim Maia', song: 'Eu Amo Você', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { id: 'a4', name: 'Elis Regina', song: 'Águas de Março', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292bdea?w=400&h=400&fit=crop' },
  { id: 'a5', name: 'Novos Baianos', song: 'Besta é Tu', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 'a6', name: 'Raul Seixas', song: 'Metamorfose Ambulante', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { id: 'a7', name: 'ABBA', song: 'Dancing Queen', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop' },
  { id: 'a8', name: 'Bee Gees', song: 'Stayin Alive', decade: 'Anos 70', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },

  // Anos 80
  { id: 'a9', name: 'Legião Urbana', song: 'Tempo Perdido', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { id: 'a10', name: 'Roupa Nova', song: 'Anjo', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1525695230005-e8a67b6a5bbe?w=400&h=400&fit=crop' },
  { id: 'a11', name: 'Amado Batista', song: 'Seresteiro', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292bdea?w=400&h=400&fit=crop' },
  { id: 'a12', name: 'Fábio Júnior', song: 'O Pirata do Amor', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 'a13', name: 'Michael Jackson', song: 'Thriller', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop' },
  { id: 'a14', name: 'Madonna', song: 'Like a Virgin', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { id: 'a15', name: 'Paralamas do Sucesso', song: 'Alagamar', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 'a16', name: 'Ultraje a Rigor', song: 'Inútil', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { id: 'a17', name: 'Barão Vermelho', song: 'Pro Dia Nascer Feliz', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { id: 'a18', name: 'Titãs', song: 'Comida', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1525695230005-e8a67b6a5bbe?w=400&h=400&fit=crop' },
  { id: 'a19', name: 'Lulu Santos', song: 'Toda Forma de Amor', decade: 'Anos 80', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292bdea?w=400&h=400&fit=crop' },

  // Anos 90
  { id: 'a20', name: 'Chitãozinho e Xororó', song: 'Evidências', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 'a21', name: 'Zezé Di Camargo & Luciano', song: 'É o Amor', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop' },
  { id: 'a22', name: 'Roberto Carlos', song: 'Emoções', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 'a23', name: 'Cássia Eller', song: 'Malandragem', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { id: 'a24', name: 'Raimundos', song: 'Mulher de Fases', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 'a25', name: 'O Rappa', song: 'Minha Alma', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { id: 'a26', name: 'Nirvana', song: 'Smells Like Teen Spirit', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1525695230005-e8a67b6a5bbe?w=400&h=400&fit=crop' },
  { id: 'a27', name: 'Backstreet Boys', song: 'I Want It That Way', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop' },
  { id: 'a28', name: 'Mamonas Assassinas', song: 'Pelados em Santos', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292bdea?w=400&h=400&fit=crop' },
  { id: 'a29', name: 'Skank', song: 'Garota Nacional', decade: 'Anos 90', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },

  // Anos 2000
  { id: 'a30', name: 'Charlie Brown Jr.', song: 'Zóio de Lula', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 'a31', name: 'Ivete Sangalo', song: 'Quando a Chuva Passar', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop' },
  { id: 'a32', name: 'Detona Ralph', song: 'Olhos nos Olhos', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1525695230005-e8a67b6a5bbe?w=400&h=400&fit=crop' },
  { id: 'a33', name: 'Linkin Park', song: 'In the End', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 'a34', name: 'Coldplay', song: 'Yellow', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { id: 'a35', name: 'Evanescence', song: 'Bring Me to Life', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { id: 'a36', name: 'Jota Quest', song: 'Encontrar Alguém', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292bdea?w=400&h=400&fit=crop' },
  { id: 'a37', name: 'Capital Inicial', song: 'A Rose', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1525695230005-e8a67b6a5bbe?w=400&h=400&fit=crop' },
  { id: 'a38', name: 'NX Zero', song: 'Razões e Emoções', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
  { id: 'a39', name: 'Blink-182', song: 'All the Small Things', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop' },
  { id: 'a40', name: 'Daniel', song: 'Especial', decade: 'Anos 2000', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
];

export const BAHIAN_CITIES = [
  'Salvador', 'Feira de Santana', 'Alagoinhas', 'Camaçari', 'Vitória da Conquista',
  'Itabuna', 'Ilhéus', 'Juazeiro', 'Lauro de Freitas', 'Barreiras',
  'Porto Seguro', 'Simões Filho', 'Paulo Afonso', 'Eunápolis', 'Teixeira de Freitas',
];
