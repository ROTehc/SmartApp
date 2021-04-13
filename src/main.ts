import {
  json,
  NextFunction,
  opine,
  Request,
  Response,
} from "https://deno.land/x/opine@1.2.0/mod.ts";
import { opineCors } from "https://deno.land/x/cors/mod.ts";
import {
  createCIN,
  createContainer,
  createSubscription,
  registerAE,
} from "./cse-com.ts";
import { Node } from "./types.ts";
import {
  calculateAQI,
  getActuatorsCloseToSensor,
  onActuatorSubscription,
  onSensorSubscription,
} from "./logic.ts";
import { logger } from "./log.ts";

// Read Configuration
const { SCHEMA, ADDR, PORT } = JSON.parse(
  await Deno.readTextFile("config/ae.config.json"),
);

const AE_URL = `${SCHEMA}://${ADDR}:${PORT}`;

// Maps
const sensorNodes: Map<string, Node> = new Map();
const actuatorNodes: Map<string, Node> = new Map();

// Start App
const app = opine();
app.use(json());
app.use(opineCors());

// Verification middleware
function verify(req: Request, res: Response, next: NextFunction) {
  if (req.body["m2m:sgn"].vrq) {
    logger("SUB", "Subscription verified");
    res.setStatus(200).set("X-M2M-RSC", "2000").send();
  } else {
    next();
    res.sendStatus(200);
  }
}

app.use(verify);

// Helpers
const isCnt = (rep: { [key: string]: string }) =>
  Object.prototype.hasOwnProperty.call(rep, "m2m:cnt");

// Subscription Handlers
app.post("/new*", (req, res) => {
  const type = req.url.slice(4);
  const cntRn = req.body["m2m:sgn"].nev.rep["m2m:cnt"].rn;
  const uri = `/${type}s/${cntRn}`;
  const rn = `sub${cntRn}`;
  const lbl = `sub${type}_${cntRn}`;
  const endpoint = `${AE_URL}/${cntRn}`;
  // console.trace({ type, cntRn, uri, rn, lbl, endpoint });
  logger("SUCCESS", "A new", type, "has been created");
  createSubscription(
    uri,
    rn,
    lbl,
    endpoint,
  );
});

// Sensors Handler
app.post("/Sensor*", (req, res) => {
  const sensor = req.url.slice(1); // Sensor RN
  const rep = req.body["m2m:sgn"].nev.rep; // Notification data
  if (isCnt(rep)) { // If its a container...
    const cntName = rep["m2m:cnt"].rn; // Get its RN, DATA or LOCATION
    // Create a subscription to the container
    const uri = `/Sensors/${sensor}/${cntName}`;
    const rn = `"sub${cntName}${sensor}`;
    const lbl = cntName;
    const endpoint = `${AE_URL}/${sensor}`;
    createSubscription(
      uri,
      rn,
      lbl,
      endpoint,
    );
  } else { // If its a content instance
    let { lbl, con } = rep["m2m:cin"]; // Get its label and data
    con = JSON.parse(con); // Parse the data
    if (lbl.includes("LOCATION")) { // If its a location instance
      onSensorSubscription( // Call onSensorSubscription
        sensor,
        {
          coordinates: {
            lat: con.lat,
            lon: con.lon,
          },
        },
        actuatorNodes,
        sensorNodes,
      );
      logger("LOC", "The location of", sensor, "is", Deno.inspect(con));
    } else { // If its a reading
      // Get the closest actuators
      const closeActuators: string[] = getActuatorsCloseToSensor(
        sensor,
        actuatorNodes,
      );
      if (closeActuators.length !== 0) { // If the list isnt empty
        logger(
          "INF",
          "The actuators close to",
          sensor,
          "are",
          closeActuators.join(", "),
        );
        console.table(con);
        const AQI = calculateAQI(con).toFixed(1); // Calculate the AQI
        logger("AQI", `Sending AQI ${AQI} from ${sensor} to ${closeActuators}`);
        closeActuators.forEach((a) => {
          const uri = `/Actuators/${a}/QUALITY`;
          createCIN(
            uri,
            AQI,
          );
        });
      } else {
        logger("DAT", `${sensor} sent ${Deno.inspect(con)}`);
      }
    }
  }
});

// Actuators Handler
app.post("/Actuator*", (req, res) => {
  const actuator = req.url.slice(1);
  const rep = req.body["m2m:sgn"].nev.rep;
  if (isCnt(rep)) {
    if (rep["m2m:cnt"].rn === "LOCATION") {
      const uri = `/Actuators/${actuator}/LOCATION`;
      const rn = `subLoc${actuator}`;
      const lbl = "LOCATION";
      const endpoint = `${AE_URL}/${actuator}`;
      // console.trace({ uri, rn, lbl, endpoint });
      createSubscription(
        uri,
        rn,
        lbl,
        endpoint,
      );
    }
  } else {
    let { con, lbl } = rep["m2m:cin"];
    con = JSON.parse(con);
    logger("LOC", actuator, "->", con);
    onActuatorSubscription(
      actuator,
      {
        coordinates: {
          lat: con.lat,
          lon: con.lon,
        },
        closest: undefined,
      },
      actuatorNodes,
      sensorNodes,
    );
    logger("LOC", "The location of", actuator, "is", Deno.inspect(con));
  }
});

// Run App
app.listen(PORT, () => {
  console.clear();
  logger("INF", "SmartApp listening on port", PORT);
});

// Boot
// Create SmartApp AE
await registerAE();

// Create Sensors CNT
await createContainer("Sensors");

// Create Actuators CNT
await createContainer("Actuators");

// Subscription
await createSubscription(
  "/Sensors",
  "subSensors",
  "SENSORS",
  AE_URL + "/newSensor",
);
await createSubscription(
  "/Actuators",
  "subActuators",
  "ACTUATORS",
  AE_URL + "/newActuator",
);
