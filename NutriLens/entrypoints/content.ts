import { I18n } from '../src/i18n/I18n';
import { AdapterRegistry } from "@/src/core/AdapterRegistry";
import { Orchestrator } from "@/src/core/Orchestrator";
import "@/src/core/Register";

export default defineContentScript({
  matches: ['*://*.metro.ca/*', '*://*.walmart.ca/*', '*://localhost/*'],
  runAt: 'document_idle',
  async main(ctx) {
    const adapter = AdapterRegistry.resolve(window.location.hostname);
    if (!adapter) return;

    const orchestrator = new Orchestrator(adapter);
    orchestrator.init();

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "SETTINGS_CHANGED" && message.settings) {
        I18n.init(message.settings.language);
        orchestrator.refresh();
        return false;
      }
      return false;
    });
  },
});

