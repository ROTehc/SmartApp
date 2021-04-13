import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { findClosest, getActuatorsCloseToSensor } from "../src/logic.ts";

Deno.test("findClosest returns undefined if there are no sensors", () => {
  const sensorNodes: Map<string, Node> = new Map();
  const actuator = {
    coordinates: {
      lon: 0,
      lat: 0,
    },
    closest: undefined,
  };
  const closest = findClosest(actuator, sensorNodes);
  assertEquals(closest, undefined);
});

Deno.test("Finds the closest sensor to an actuator", () => {
  const sensorNodes: Map<string, Node> = new Map();
  const closeSensor = {
    coordinates: {
      lon: 1,
      lat: 1,
    },
  };
  const farSensor = {
    coordinates: {
      lon: 10,
      lat: 10,
    },
  };
  const actuator = {
    coordinates: {
      lon: 0,
      lat: 0,
    },
    closest: undefined,
  };
  sensorNodes.set("closeSensor", closeSensor);
  sensorNodes.set("farSensor", farSensor);
  const closest = findClosest(actuator, sensorNodes);
  assertEquals(closest, "closeSensor");
});

Deno.test("Finds the closest actuators to a sensor", () => {
  const actuatorNodes: Map<string, ActuatorNode> = new Map();
  const sensorRn = "sensor";
  const ac1 = {
    coordinates: {
      lon: 1,
      lat: 1,
    },
    closest: "sensor",
  };
  const ac2 = {
    coordinates: {
      lon: 10,
      lat: 10,
    },
    closest: "sensor",
  };

  actuatorNodes.set("ac1", ac1);
  actuatorNodes.set("ac2", ac2);
  const closest = getActuatorsCloseToSensor(sensorRn, actuatorNodes);
  assertEquals(closest, ["ac1", "ac2"]);
});
