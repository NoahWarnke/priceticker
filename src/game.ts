
import {PriceTracker} from 'pricetracker';
import {PriceUpdateSystem} from 'priceupdatesystem';

// Set up price trackers.
let trackers = [
  new PriceTracker("BTCUSDT", new Transform({position: new Vector3(8, 1, 8)})),
  new PriceTracker("ETHUSDT", new Transform({position: new Vector3(8, 2, 8)})),
  new PriceTracker("MANAETH", new Transform({position: new Vector3(8, 3, 8)}))
];

// Set up time object.
let time = new Entity();
let timeText = new TextShape("...");
time.addComponent(timeText);
time.addComponent(new Transform({position: new Vector3(8, 4, 8)}));
engine.addEntity(time);

// Create update system to update the trackers and the time.
engine.addSystem(new PriceUpdateSystem(trackers, timeText));
