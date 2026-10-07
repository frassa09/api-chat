FROM ollama/ollama:latest

# Instala o curl para checagens de saúde (opcional)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copia o script de inicialização e dá permissão de execução
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expõe a porta padrão da API do Ollama
EXPOSE 11434

ENTRYPOINT ["/entrypoint.sh"]