# api-chat

# Docker
para subir a imagem docker:
docker compose up --build -d

para testar se o modelo responde:
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:1b",
  "prompt": "Olá! Responda em uma frase: o que é uma API Restful?",
  "stream": false
}'

# ver log
docker logs -f ollama_ia

# Rodar modelo de IA no terminal
docker exec -it ollama_ia ollama run llama3.2:1b