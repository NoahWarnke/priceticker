export class PriceTracker {
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
