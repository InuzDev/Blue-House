# Blue House

## What is this?

Blue House is a IoT project made for 2025 Fair Science in La Salle School. The objective is a Smart Energy Monitor, but centralized on security, this also use the advantage of the Arduino MKR1000 capable of connecting to the internet, we made a dashboard specially for this SEM.

> I'm strongly recommend check the original documentation of each software we use in this project.

---

## IoT development / Hardware programming.

There is a file in lib, is `secret.h`. By obvious reasons I won't be sharing mine, but I will give you guys the example file of it:

```h
// This is already imported in the main.cpp file, so you just need to redefine the variables in the file you guys created.

#ifndef SECRETS_H
#define SECRETS_H

#define SERVER_ADDRESS "" // Server address here
#define BACKEND_PORT 8000 // Backend port here
#define WIFI_SSID ""      // Network name here
#define WIFI_PASSWORD ""  // Network password here

#endif
```

As I'm using visual studio code as my text editor, plus with PlatoformIO, I can configure the includePath easily with the C/CPP plugin. 

Depending on your configurations and installations, the settings of the plugin should look like this (usually configured automatically by PlatformIO when you start a project)

```json
"c:/Users/{user_username}/Desktop/{Project-name-or-directory}/include"
"c:/Users/{user_username}/Desktop/{Project-name-or-directory}/lib"
"c:/Users/{user_username}/Desktop/{Project-name-or-directory}/src"
```

I have my project located in the Desktop, but you can have it anywhere you want or need.

---

# Backend development

As we work with the project, we need to store the data somewhere. We opted to use MongoDB as our database and build our API with Nest.JS.

```shell
# We start with the installation of dependencies.
# Make sure to be in the right directory

$ npm install
# or
$ npm i
```
> My directory is "~\Desktop\Blue House\API"

From the README of Nest.JS when you create the project

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

# Front-End Development

We decided to make a dashboard to visualize the data from the sensors. so we opted to use Next.Js and connect it with our API.

You can find the folder `Blue House Dashboard`, where the Front-end code is located
Since Next.Js run in the port 3000, we decided to change the API port to 8000.

We still need to make some changes to the dashboard as some data aren't being read, but the logged data from the sensors are being stored and can be readed from a table.

Remember to change your directory to the dashboard folder.

```shell
# In case you're in the root (Blue-House) run this command

$ cd "Blue House Dashboard"
```

After moving to the front-end directory, install the dependencies with:

```shell
# Bun (Remember, if you're using bun. To add more dependencies you need to use "bun add <dependency name>"
$ bun i

# NPM
$ npm install
# or
$ npm i
```

Then, run the default dev script that comes with the creation of a next.js project.

```shell
# In my Project, turbo is enabled. If you wish, you can disable in your end.

$ npm run dev
```
