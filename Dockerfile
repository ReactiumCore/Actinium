FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npx -p @atomic-reactor/cli arcli install
RUN npm prune --production

# Bundle app source
COPY . .

RUN chown -R node /usr/src/app

USER node

EXPOSE 9000

CMD [ "npm", "start" ]
