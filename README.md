# Lazy Model-View-Controller

> An MVC pattern example project to illustrate how to use `lazy-toolbox`.

## Index

- [Configuration](#configuration)
- [Installation](#install)
- [Structure](#structure)

## [Configuration](#configuration)

**environment**
Before doing anything, you need to have a look at `.env.example` file at the project's root.
It contains a bunch of properties you'll use for your server.

**webpack**
The `webpack.config.js` is configured by default for development. It goes without saying, it's also configured for a single client pack so if you need more, add more like they said.

## [Installation](#install)

Clone the repository, then enter the commands in the following order:
```bash
npm install
npm run dev
```

`npm run dev` will always compile then run the project while also checking for changes.

## [Structure](#structure)

### src

All scripts and stylesheets sources files are contained in this directory. 
`src/client/`: Directory containing the client scripts, repacked from `main.ts`.
`src/stylesheets/`: Directory containing all stylesheets in `.sass` or `.scss` format.
`src/middleware/`: Directory containing all routes and implement a controller to handle the backend logic.
`src/controller/`: Directory containing all controllers for `middleware`.
`src/sockets/onConnect`: Directory containing all functions to be executed when a client connect to a socket.
`src/sockets/onMessages`: Directory containing all functions to be executed when a client send a message to a socket.
`src/sockets/onDisconnect`: Directory containing all functions to be executed when a client disconnect to a socket.