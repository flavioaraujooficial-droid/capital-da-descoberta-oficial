const handleConfirmVote = async (info) => {
    if (!pendingVote) return;
    setLoginOpen(false);

    // Mapeamento automático inteligente baseado na cidade informada pelo usuário
    let territorioFinal = territory.name;
    const cidadeLower = info.city.toLowerCase();

    // Dicionário de regiões para abranger os principais polos e municípios da Bahia
    const regioesMetropolitanaSalvador = [
      "salvador", "camaçari", "laurim de freitas", "lauro de freitas", "simões filho", 
      "candeias", "mata de são joão", "são sebastião do passé", "madre de deus", 
      "itaparica", "vera cruz", "dias d'ávila"
    ];

    const regioesLitoralNorteAgreste = [
      "catu", "alagoinhas", "aramari", "araçás", "acajutiba", "apora", "inhambupe", 
      "entre rios", "esplanada", "conde", "crisópolis", "jeremoabo", "ribeira do pombal",
      "serrinha", "retirolândia", "barrocas", "teofilândia", "biritinga", "coaraci"
    ];

    const regioesFeiraRecôncavo = [
      "feira de santana", "santo amaro", "cáchoeira", "são félix", "muritiba", 
      "governador mangabeira", "sapo-açu", "sapeaçu", "cruz das almas", "santo antônio de jesus",
      "amargosa", "laje", "são miguel das matas", "muniz ferreira", "saubara", "orós"
    ];

    const regioesSulBaiano = [
      "itabuna", "ilhéus", "itabuna", "canavieiras", "universo", "eunápolis", 
      "porto seguro", "santa cruz cabrália", "prado", "itamaraju", "teixeira de freitas"
    ];

    const regioesSudoestePlanalto = [
      "vitória da conquista", "poções", "planalto", "ibicuí", "itapetinga", 
      "guanambi", "caetité", "macarani", "itambé"
    ];

    const regioesSertaoSaoFrancisco = [
      "juazeiro", "senhor do bonfim", "jacobina", "campo formoso", "euclides da cunha",
      "paulo afonso", "santa brígida", "canudos", "roraima", "casa nova", "remanso"
    ];

    // Verifica a qual polo a cidade pertence e define o território correspondente
    if (regioesMetropolitanaSalvador.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Região Metropolitana de Salvador";
    } else if (regioesLitoralNorteAgreste.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Litoral Norte e Agreste Baiano";
    } else if (regioesFeiraRecôncavo.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Recôncavo e Portal do Sertão";
    } else if (regioesSulBaiano.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Sul e Extremo Sul Baiano";
    } else if (regioesSudoestePlanalto.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Sudoeste e Planalto Conquistense";
    } else if (regioesSertaoSaoFrancisco.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Sertão e São Francisco";
    }

    const { error } = await supabase.from('votes').insert({
      artist_name: pendingVote.artistName,
      song_name: pendingVote.songName,
      decade: pendingVote.decade,
      image_url: pendingVote.imageUrl,
      voter_name: info.name,
      city: info.city,
      instagram: info.instagram || null,
      is_custom: pendingVote.isCustom,
      territory: territorioFinal, // Vincula o território detectado automaticamente!
    });

    if (error) {
      showToast('Erro ao registrar voto. Tente novamente.');
      return;
    }

    setCardData({
      artistName: pendingVote.artistName,
      songName: pendingVote.songName,
      decade: pendingVote.decade,
      imageUrl: pendingVote.imageUrl,
      voter: info,
      territory: { ...territory, name: territorioFinal },
    });
    setCardOpen(true);
    setPendingVote(null);
    loadVotes();
    showToast('Voto confirmado com sucesso!');
  };
