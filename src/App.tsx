// Busca na Deezer via API com Proxy para evitar erro de CORS
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const targetUrl = `https://api.deezer.com/search?q=${encodeURIComponent(searchQuery)}&limit=10`;
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) throw new Error('Erro na requisição');
        
        const data = await response.json();
        if (data && data.data) {
          setSearchResults(data.data);
        }
      } catch (err) {
        console.error('Erro ao buscar músicas:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);
