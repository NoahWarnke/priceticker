
class PriceTracker {
  public symbol: string;
  public price: number;
  public textShape: TextShape;
  
  constructor(symbol: string, transform: Transform) {
    
    this.symbol = symbol;
    this.price = -1;
    
    let ent = new Entity();
    
    this.textShape = new TextShape("...");
    ent.addComponent(this.textShape);
    
    ent.addComponent(transform);
    
    engine.addEntity(ent);
  }
  
  updatePrice(price: number) {
    this.price = price;
    this.textShape.value = this.symbol + ": " + parseFloat(this.price.toString());
  }
}

class PriceUpdateSystem {
  
  public trackers: PriceTracker[];
  public timeText: TextShape;
  
  public lastUpdated: number;
  public startSeconds: number;
  
  constructor(trackers: PriceTracker[], timeText: TextShape) {
    this.trackers = trackers;
    this.timeText = timeText;
    
    this.startSeconds = Math.floor(Date.now() / 1000); // Starting time in seconds.
    let clockSeconds = new Date().getSeconds();
    let onesPlace = clockSeconds - Math.floor(clockSeconds / 10) * 10;
    this.lastUpdated = this.startSeconds - onesPlace;
    
    this.getNewPrices();
  }
  
  public update(dt: number) {
    let currentSeconds = Math.floor(Date.now() / 1000);
    if (currentSeconds - this.lastUpdated >= 10) { // Every 10 seconds.
      this.lastUpdated = currentSeconds;
      this.getNewPrices();
    }
    
  }
  
  public async getNewPrices() {
    try {
      
      // Update datetime first - don't really care how long the api takes to return.
      let date = new Date();
      this.timeText.value = date.getUTCFullYear() + "-"
        + (date.getUTCMonth() < 9 ? "0" : "") + (date.getUTCMonth() + 1) + "-"
        + (date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate() + " "
        + (date.getUTCHours() < 10 ? "0" : "") + date.getUTCHours() + ":"
        + (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes() + ":"
        + (date.getUTCSeconds() < 10 ? "0" : "") + date.getUTCSeconds()
        + " UTC"
      ;
      
      // Now grab the data (with fix for CORS issue).
      let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      let targetUrl = 'https://api.binance.com/api/v1/ticker/allPrices';
      let response = await fetch(proxyUrl + targetUrl);
      let json = await response.json();
      
      let prices = {};
      for (var i = 0; i < json.length; i++) {
        prices[json[i].symbol] = json[i].price;
      }
      
      for (let tracker of this.trackers) {
        tracker.updatePrice(prices[tracker.symbol]);
      }
    }
    catch {
      log("Failed to connect to Binance API.");
    }
  }
}

let trackers = [
  new PriceTracker("BTCUSDT", new Transform({position: new Vector3(8, 1, 8)})),
  new PriceTracker("ETHUSDT", new Transform({position: new Vector3(8, 2, 8)})),
  new PriceTracker("MANAETH", new Transform({position: new Vector3(8, 3, 8)}))
];

let time = new Entity();
let timeText = new TextShape("...");
time.addComponent(timeText);
time.addComponent(new Transform({position: new Vector3(8, 4, 8)}));
engine.addEntity(time);

engine.addSystem(new PriceUpdateSystem(trackers, timeText));
