# Proxy

[![Generic badge](https://img.shields.io/badge/DENO-0AF.svg)](https://shields.io/)
[![oneM2M](https://img.shields.io/badge/oneM2M-f00)](https://www.onem2m.org)

This proxy was made to sort a CORS-related issue.
Built with [deno](https://deno.land/) and [opine](https://deno.land/x/opine@1.2.0).

## Usage

Send a GET request to the "/getData" endpoint to get the processed CSE data.

### config.json

```json
{
	"PORT": xxxx,
	"SCHEMA": "xxxx",
	"CSE_IP": "xxx.xxx.xxx.xxx",
	"CSE_PORT": xxxx
}
```

The `SCHEMA` property should be set to either http or https.
