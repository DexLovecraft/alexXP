# Étape 1 : Build avec Node.js
FROM node:20 AS builder
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Construire le projet (ton dist/ est généré ici)
RUN npm run build

# Étape 2 : Serveur Nginx minimal
FROM nginx:1.29.1-alpine

# Supprimer la config par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers générés dans Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
