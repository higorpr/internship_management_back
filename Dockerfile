# Imagem base
FROM node:16

WORKDIR /usr/src

COPY . .

# Porta 
EXPOSE 4000

# Instala as dependências
RUN npm i

# Cria a build (compila o .ts em .js)
RUN rpm run build

# Comando a ser executado quando alguém rodar a imagem
CMD [ "npm", "start" ]

