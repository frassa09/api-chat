#!/bin/sh

# Inicia o servidor do Ollama em segundo plano e guarda o PID
ollama serve &
OLLAMA_PID=$!

# Aguarda o serviço inicializar
sleep 5

# Baixa o modelo Llama 3.2 de 1B
echo "==> Baixando o modelo llama3.2:1b..."
ollama pull llama3.2:1b

# Mantém o container ativo aguardando o processo principal do Ollama
wait $OLLAMA_PID