import express from "express";
import { setup } from "client/src/mud/setup";
import mudConfig from "contracts/mud.config";
import { getComponentValueStrict } from "@latticexyz/recs";

// Connect to MUD
const {
  components,
  systemCalls: { increment },
  network,
} = await setup();

// Setup Express App
const app = express();
const PORT = process.env.PORT || 7000

// Start the Server
app.listen(PORT, () => {
  console.log("Server is up and running on port %s", PORT);
});

// Global counter value for testing
let counterValue: number = 0;

// Get the current counter value
app.get('/', (req, res) => {
  res.send('Count is %d', counterValue);
});


// Subscribe for table updates.  This is where I would like to fire off pubsub events
components.Counter.update$.subscribe((update) => {
  const [nextValue, prevValue] = update.value;
  counterValue = nextValue.value as number;
  console.log("Counter updated", update, { nextValue, prevValue });
});

