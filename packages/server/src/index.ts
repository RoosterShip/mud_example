import express, { Express, Request, Response } from "express";
import { setup } from "./mud/setup";
import mudConfig from "contracts/mud.config";
import { getComponentValueStrict } from "@latticexyz/recs";

// Connect to MUD
const {
  components,
  network,
} = await setup();

// Setup Express App
const app: Express = express();
const PORT = process.env.PORT || 7000

// Start the Server
app.listen(PORT, () => {
  console.log("Server is up and running on port %s", PORT);
});

// Global counter value for testing
let counterValue: number = 0;

// Get the current counter value
app.get("/counter", (req: Request, res: Response) => {
  res.send(counterValue.toString());
});

// Subscribe for table updates.  This is where I would like to fire off pubsub events
components.Counter.update$.subscribe((update) => {
  const [nextValue, prevValue] = update.value;
  counterValue = nextValue!.value as number;
  console.log("Counter value is now: %d", counterValue);
});
