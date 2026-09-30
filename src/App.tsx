const handleConfirmVote = async (info) => {
  if (!pendingVote) return;
  setLoginOpen(false);

  // Mapeamento automático e invisível de território para o Supabase
  let territorioFinal = "Bahia";
  const cidadeLower = info.city ? info.city.toLowerCase().trim() : "";

  // Polos regionais da Bahia
  const regioesMetropolitanaSalvador = [
    "salvador", "camaçari", "lauro de freitas", "simões filho", 
    "candeias", "mata de são joão", "são sebastião do passé", "madre de deus", 
    "itaparica", "vera cruz", "dias d'ávila"
  ];

  const regioesLitoralNorteAgreste = [
    "catu", "alagoinhas", "aramari", "araçás", "acajutiba", "apora", "inhambupe", 
    "entre rios", "esplanada", "conde", "crisópolis", "jeremoabo", "ribeira do pombal",
    "serrinha", "retirolândia", "barrocas", "teofilândia", "biritinga", "coaraci"
  ];

  const regioesFeiraReconcavo = [
    "feira de santana", "santo amaro", "cachoeira", "são félix", "muritiba", 
    "governador mangabeira", "sapeaçu", "cruz das almas", "santo antônio de jesus",
    "amargosa", "laje", "são miguel das matas", "muniz ferreira", "saubara"
  ];

  const regioesSulBaiano = [
    "itabuna", "ilhéus", "canavieiras", "eunápolis", 
    "porto seguro", "santa cruz cabrália", "prado", "itamaraju", "teixeira de freitas"
  ];

  const regioesSudoestePlanalto = [
    "vitória da conquista", "poções", "planalto", "ibicuí", "itapetinga", 
    "guanambi", "caetité", "macarani", "itambé"
  ];

  const regioesSertaoSaoFrancisco = [
    "juazeiro", "senhor do bonfim", "jacobina", "campo formoso", "euclides da cunha",
    "paulo afonso", "santa brígida", "canudos", "casa nova", "remanso"
  ];

  // Atribuição interna do território
  if (regioesMetropolitanaSalvador.some(c => cidadeLower.includes(c))) {
    territorioFinal = "Região Metropolitana de Salvador";
  } else if (regioesLitoralNorteAgreste.some(c => cidadeLower.includes(c))) {
    territorioFinal = "Litoral Norte e Agreste Baiano";
  } else if (regioesFeiraReconcavo.some(c => cidadeLower.includes(c))) {
    territorioFinal = "Recôncavo e Portal do Sertão";
  } else if (regioesSulBaiano.some(c => cidadeLower.includes(c))) {
    territorioFinal = "Sul e Extremo Sul Baiano";
  } else if (regioesSudoestePlanalto.some(c => cidadeLower.includes(c))) {
    territorioFinal = "Sudoeste e Planalto Conquistense";
  } else if (regioesSertaoSaoFrancisco.some(c => cidadeLower.includes(c))) {
    territorioFinal = "Sertão e São Francisco";
  }

  // Grava os dados no Supabase
  const { error } = await supabase.from('votes').insert({
    artist_name: pendingVote.artistName,
    song_name: pendingVote.songName,
    decade: pendingVote.decade,
    image_url: pendingVote.imageUrl,
    voter_name: info.name,
    city: info.city,
    instagram: info.instagram || null,
    is_custom: pendingVote.isCustom || false,
    territory: territorioFinal, // Salva o território nos bastidores
  });

  if (error) {
    showToast('Erro ao registrar voto. Tente novamente.');
    return;
  }

  // Prepara e abre o card visual (compatível com a nova tela)
  setCardData({
    artistName: pendingVote.artistName,
    songName: pendingVote.songName,
    decade: pendingVote.decade,
    imageUrl: pendingVote.imageUrl,
    voter: info
  });
  
  setCardOpen(true);
  setPendingVote(null);
  if (typeof loadVotes === 'function') loadVotes();
  showToast('Voto confirmado com sucesso!');
};
