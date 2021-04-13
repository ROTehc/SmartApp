import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { average, calculateAQI, gasAQI } from "../src/logic.ts";

Deno.test("Average of the numbers from 0 to 4 is 2", () => {
  const avg = average([0, 1, 2, 3, 4]);
  assertEquals(avg, 2, `Average: ${avg}`);
});

Deno.test("Gas AQI is 10 when high", () => {
  const aqi = gasAQI(1500, 400, 1000);
  assertEquals(aqi, 10, `AQI: ${aqi}`);
});

Deno.test("Gas AQI is 1 when low", () => {
  const aqi = gasAQI(200, 400, 1000);
  assertEquals(aqi, 1, `AQI: ${aqi}`);
});

Deno.test("Gas AQI is between 1 and 10 when Ok", () => {
  const aqi = gasAQI(500, 400, 1000);
  assert(aqi >= 1 && aqi <= 10, `AQI: ${aqi}`);
});

Deno.test("AQI average is 10 when all are high", () => {
  const readings = {
    co2: 1500,
    o3: 70,
    no2: 60,
    so2: 60,
  };
  const aqi = calculateAQI(readings);
  assertEquals(aqi, 10, `AQI: ${aqi}`);
});

Deno.test("AQI average is 1 when all are low", () => {
  const readings = {
    co2: 200,
    o3: 30,
    no2: 20,
    so2: 20,
  };
  const aqi = calculateAQI(readings);
  assertEquals(aqi, 1, `AQI: ${aqi}`);
});

Deno.test("AQI average between 1 and 10 when all are Ok", () => {
  const readings = {
    co2: 500,
    o3: 40,
    no2: 30,
    so2: 30,
  };
  const aqi = calculateAQI(readings);
  assert(aqi >= 1 && aqi <= 10, `AQI: ${aqi}`);
});
