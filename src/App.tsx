const handleConfirmVote = async (info) => {
    if (!pendingVote) return;
    setLoginOpen(false);

    // Mapeamento automático inteligente dos territórios baseado na cidade informada
    // (Garante que cidades como Catu, Alagoinhas, etc., caiam no território correto)
    let territorioFinal = territory.name;
    const cidadeLower = info.city.toLowerCase();

    // Exemplo de mapeamento dinâmico para a região de Catu / Alagoinhas e arredores
    const cidadesLitoralNorteAgreste = [
      "catu", "alagoinhas", "aramari", "araçás", "acajutiba", "apora", "inhambupe", 
      "entre rios", "Esplanada", "conde", "crisópolis", "jeremoabo", "ribeira do pombal"
    ];

    if (cidadesLitoralNorteAgreste.some(c => cidadeLower.includes(c))) {
      territorioFinal = "Litoral Norte e Agreste Baiano";
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
      territory: territorioFinal, // Usa o território detectado automaticamente pela cidade!
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
