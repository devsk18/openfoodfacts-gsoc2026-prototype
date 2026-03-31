import { AdapterRegistry } from './AdapterRegistry';
import { MetroAdapter } from '../core/adapters/MetroAdapter';

// register all supported sites here
AdapterRegistry.register("www.metro.ca", MetroAdapter);

export { AdapterRegistry };