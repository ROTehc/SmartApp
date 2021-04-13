# ROTehc Smart App

[![Generic badge](https://img.shields.io/badge/DENO-0AF.svg)](https://shields.io/)
[![oneM2M](https://img.shields.io/badge/oneM2M-f00)](https://www.onem2m.org)

This proxy was made to sort a CORS-related issue.
Built with [**Deno**](https://deno.land/) and [**Opine**](https://deno.land/x/opine@1.2.0) to comunicate with a [**OneM2M**](https://www.onem2m.org/) CSE.

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
 ┣ 📜LICENSE
 ┗ 📜README.md
```
