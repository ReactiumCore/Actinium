# Build Stage
FROM node:lts-hydrogen as build

# Create app directory
WORKDIR /tmp/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

# Install NPM and Reactium registry dependencies
RUN npx reactium install
RUN npm prune --production

# Begin Deployable Stage - Ignores layers above in final image
FROM node:lts-hydrogen

# Create app directory
WORKDIR /usr/src/app

# Server dependencies
COPY --from=build /tmp/app/package.json ./package.json
COPY --from=build /tmp/app/node_modules ./node_modules

# Actinium modules from Reactium registry
COPY --from=build /tmp/app/actinium_modules ./actinium_modules

# The server source
COPY --from=build /tmp/app/src ./src
COPY --from=build /tmp/app/.core ./.core

RUN chown -R node /usr/src/app

USER node

EXPOSE 9000

CMD [ "npm", "start" ]
