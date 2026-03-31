import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'API Interceptor',
    version: '1.0.0',
    description: 'Intercepts API calls on various websites',
    permissions: ['storage', 'activeTab'],
    host_permissions: [
      '*://*.loblaws.ca/*',
      '*://*.costco.ca/*',
      '*://api.pcexpress.ca/*',
    ],
  },
});
