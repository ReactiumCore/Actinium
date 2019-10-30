# Simple Docker Example

Example using docker machine and simple docker container commands.

Creates network for containers.

```
docker network create atomic-reactor
```

Create mongo container
```
docker run -d --network atomic-reactor --name mongo --rm mongo:3.6.2
```

Creates Actinium container on network
```
docker run --network atomic-reactor \
    --name actinium \
    -d -p 9000:9000 \
    -e PARSE_DASHBOARD_ALLOW_INSECURE_HTTP=true \
    -e PUBLIC_SERVER_URI="http://$(docker-machine ip):9000" \
    -e LOG_METHOD=stdout \
    -e APP_NAME="Atomic Reactor API" \
    -e DATABASE_URI=mongodb://mongo/atomic-reactor \
    atomicreactor/actinium:2.0.0
```
