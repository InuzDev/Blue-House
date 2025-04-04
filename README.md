# Blue House

## What is this?

Blue House is a IoT project made for 2025 Fair Science in La Salle School. The objective is a Smart Energy Monitor, but centralized on security, this also use the advantage of the Arduino MKR1000 capable of connecting to the internet, we made a dashboard specially for this SEM.

There is a file in lib, is `secret.h`. By obvious reasons I won't be sharing mine, but I will give you guys the example file of it:

```h
// This is already imported in the main.cpp file, so you just need to redefine the variables in the file you guys created.

#ifndef SECRETS_H
#define SECRETS_H

#define WIFI_SSID "" // Network name here
#define WIFI_PASSWORD "" // Network password here

#endif
```