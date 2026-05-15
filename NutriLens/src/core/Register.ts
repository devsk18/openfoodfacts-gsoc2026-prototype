import { AdapterRegistry } from './AdapterRegistry';
import { MetroAdapter } from './adapters/MetroAdapter';
import { TestAdapter } from './adapters/TestAdapter';
import { WalmartAdapter } from './adapters/WalmartAdapter';


// register all supported sites here
AdapterRegistry.register("www.metro.ca", MetroAdapter);
AdapterRegistry.register("www.walmart.ca", WalmartAdapter);
AdapterRegistry.register("localhost", TestAdapter);

export { AdapterRegistry };