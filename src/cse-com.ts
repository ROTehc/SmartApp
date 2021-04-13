import { logger } from "./log.ts";

const { SCHEMA, ADDR, PORT } = JSON.parse(
  await Deno.readTextFile("config/cse.config.json"),
);

const CSE_URL = `${SCHEMA}://${ADDR}:${PORT}`;

function handleResponse(
  res: Response,
  successType: string,
  successMsg: string,
  error: string,
) {
  if (res.status === 201) {
    logger(successType, successMsg);
  } else {
    logger("ERR", error);
    console.log(res);
  }
}

function headerBuilder(ty: number) {
  return {
    "X-M2M-Origin": "SmartApp",
    "X-M2M-RVI": "3",
    "X-M2M-RI": Math.random().toString().substr(2, 16),
    "Content-Type": "application/vnd.onem2m-res+json; ty=" + ty,
  };
}

// Posts
export async function postToCSE(uri: string, ty: number, body: string) {
  const url = CSE_URL + uri;
  return await fetch(url, {
    method: "POST",
    headers: headerBuilder(ty),
    body: body,
  });
}

export async function registerAE() {
  const res = await postToCSE(
    "/cse-in",
    2,
    JSON.stringify({
      "m2m:ae": {
        "rn": "SmartApp",
        "api": "N.rotehc.SmartApp",
        "srv": [3],
        "rr": false,
      },
    }),
  );
  handleResponse(
    res,
    "SUCCESS",
    "Smart App registered successfully",
    "Could not register Smart App",
  );
}

export async function createContainer(rn: string) {
  const res = await postToCSE(
    "/SmartApp",
    3,
    JSON.stringify({
      "m2m:cnt": {
        "rn": rn,
      },
    }),
  );
  handleResponse(
    res,
    "SUCCESS",
    `${rn} container created successfully`,
    `Could not create ${rn} container`,
  );
}

export async function createSubscription(
  uri: string,
  rn: string,
  label: string,
  endpoint: string,
) {
  const url = `/cse-in/SmartApp${uri}`;
  const res = await postToCSE(
    url,
    23,
    JSON.stringify({
      "m2m:sub": {
        "rn": rn,
        "lbl": [label],
        "enc": {
          "net": [3, 4],
        },
        "nu": [endpoint],
        "nct": 1,
      },
    }),
  );
  handleResponse(
    res,
    "SUB",
    `${rn} subscription created successfully`,
    `Could not subscribe to ${rn}`,
  );
}

export async function createCIN(uri: string, con: string) {
  const url = `/cse-in/SmartApp${uri}`;
  const res = await postToCSE(
    url,
    4,
    JSON.stringify({
      "m2m:cin": {
        "cnf": "application/json:0",
        "con": con,
      },
    }),
  );
  handleResponse(
    res,
    "SUCCESS",
    `CIN created successfully`,
    `Could not create CIN`,
  );
}
