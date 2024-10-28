FROM node:20

# Criar diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Limpar o cache do npm antes de instalar dependências
RUN npm cache clean --force

# Instalar dependências com npm install
RUN npm install --no-audit --no-fund

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta da aplicação
EXPOSE 3018

# Definir variável de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]