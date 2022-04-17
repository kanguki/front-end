# What

Just me trying calling my apis from front-end side :D

# Why?

Recently my front-end coworker encounters several issues with CORS, cookies,... so I think it's good to give myself problems like that so I can understand theirs too :D

# Env

modify your env in **[proxy/env/front-end-env.js](proxy/env/front-end-env.js)**

# How to start

make sure you have these following tools avaible: `docker, docker-compose`

start both front-end and back-end with

```
docker-compose up
```

open your browser at `http://localhost:8080/` to access front-end 

available apis exposed by back-end service: (details at )

```
GET /hello

POST /login

POST /logout

GET,POST,PUT,DELETE / #must login first
```

# TODO

I've used nginx so I don't have to deal with CORS. I'll work with CORS later if I have time~~
