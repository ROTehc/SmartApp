# ROTehc Smart App

[![Generic badge](https://img.shields.io/badge/DENO-0AF.svg)](https://shields.io/)
[![oneM2M](https://img.shields.io/badge/oneM2M-f00)](https://www.onem2m.org)

Built with [**Deno**](https://deno.land/) and [**Opine**](https://deno.land/x/opine@1.2.0) to comunicate with a [**OneM2M**](https://www.onem2m.org/) CSE.

Our SmartApp is responsible for coordinating sensors and actuators in our project.
It finds the closest sensor to any actuator and calculates the AQI (Air Quality Index) every time a new reading is available.
Once the AQI for a sensor has been calculated, the app will send its value to the appropriate actuators.

The app also fetches and parses data from the CSE to send it to the ROTehc frontend in order to plot all sensors.

## Usage

#### Run

```zsh
deno run --allow-net --allow-read src/main.ts
```

#### Test

Run all tests:

```zsh
deno test
```

Run specific tests:

```zsh
deno test tests/NAME.test.ts
```

## Config

### ae.config.json

```json
{
	"SCHEMA": "http",
	"ADDR": "x.x.x.x",
	"PORT": port
}
```

### cse.config.json

```json
{
	"SCHEMA": "http",
	"ADDR": "x.x.x.x",
	"PORT": port
}
```

## Project Structure

```
📦SmartApp
 ┣ 📂config
 ┃ ┣ 📜ae.config.json
 ┃ ┗ 📜cse.config.json
 ┣ 📂src
 ┃ ┣ 📜cse-com.ts
 ┃ ┣ 📜log.ts
 ┃ ┣ 📜logic.ts
 ┃ ┣ 📜main.ts
 ┃ ┗ 📜types.ts
 ┣ 📂tests
 ┃ ┣ 📜aqi.test.ts
 ┃ ┣ 📜closest.test.ts
 ┃ ┗ 📜distance.test.ts
 ┣ 📜.gitignore
 ┣ 📜LICENSE
 ┗ 📜README.md
```
