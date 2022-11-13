# Lazy Model-View-Controller

> An MVC pattern example project to illustrate how to use `lazy-toolbox`.

## Index
- [Getting started](#getting-started)
    - [Installation](#install)
    - [Configuration](#configuration)
    - [Development](#development)
- [Structure](#structure)
    - [src](#src)
    - [dist](#dist)
    - [public](#public)
    - [dev-tools](#dev-tools)

## [Getting started](#getting-started)

### [Installation](#install)
To start of, clone the repository. Once you've done that, check if you have [NodeJS](https://nodejs.org/en/) installed.

You can now install the dependancies of the project by just entering the command:
```bash
npm install
```

### [Configuration](#configuration)

**environment**
Before doing anything, you need to have a look at the `.env.example` file in the project's root folder.
It contains a bunch of properties you'll use for your server.
Create a `.env` file with all thoses properties and fill them with your own configuration.

**webpack**
The `webpack.config.js` is configured by default for development. It goes without saying, it's also configured for a single client pack so if you need more, add more.

**lazy-toolbox**
Since this project is developped in parallel with `lazy-toolbox`, all changes in `lazy-toolbox` should be updated as soon as possible.

### [Development](#development)
The development pipeline was thoughtfuly crafted for an implementation that should be as lazy as possible to have all results directly.
1. Global commands:
    - `npm run build`: Build the project.
    - `npm run start`: Run the server.
    - `npm run dev`: Compile all files then run the project while also checking for changes in any files inside of `/src/`.
2. Specific commands:
    - `npm run tsc`: Execute the operations in the following order:
        1. Remove `dist` folder.
        2. Compile all TypeScript files from `src` and export them into `dist` folder.
    - `npm run webpack`: Execute the operations in the following order:
        1. Remove `public/assets/scripts` folder.
        2. Compile all TypeScript files from `src/client` and export them into `public/assets/scripts`.
    - `npm run packCSS`: Execute the operations in the following order:
        1. Remove `public/assets/stylesheets` folder.
        2. Compile all `.sass` and `.scss` from `src/stylesheets` to `.css` files in `public/assets/stylesheets`.

In case you have some problem with `lazy-toolbox`, it's possible that the version you've installed is deprecated. Use `npm run startDev` if you don't want to bother about having the last available version of `lazy-toolbox`. The command will update `lazy-toolbox` then run `npm run dev`.

## [Structure](#structure)

### [src](#src)

All scripts and stylesheets sources files are contained in this directory. 
`src/client`: Directory containing the client scripts, repacked from `main.ts`.
`src/stylesheets`: Directory containing all stylesheets in `.sass` or `.scss` format.
`src/database`: Directory containing all functions associated with the database used for the project.
`src/routes`: Directory containing all routes and implement a controller to handle the backend logic.
`src/controller`: Directory containing all controllers for `routes`.
`src/sockets/onConnect`: Directory containing all functions to be executed when a client connect to a socket.
`src/sockets/onMessages`: Directory containing all functions to be executed when a client send a message to a socket.
`src/sockets/onDisconnect`: Directory containing all functions to be executed when a client disconnect to a socket.

### [dist](#dist)

All compiled scripts are located over there. You shouldn't touch this folder.

### [public](#public)

This directory contain all the public access for the project.
- `public/assets`: Contain all assets for the project. The route of your asset is generated when the server start. If you have a file located at `public/assets/img/icon.png`, it's href should be `http://localhost/assets/img/icon.png` (or if you need the src: `/assets/img/icon.png`)
- `public/views`: Contain all views for the project. Since views are used on any `Controller`, it's path will start at the root `public/views/` folder such that a view located at `public/views/index.html` have the `viewPath` defined as `index.html`.

### [dev-tools](#dev-tools)

A directory containing some useful scripts for development purposes. `npm run dev` use it for compilation purposes.