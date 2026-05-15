import { OFFDataLayer } from "@/src/api/OFFDataLayer";
import { buildPreferenceTable } from "@/src/lib/PreferenceScore";
import { SettingsService } from "@/src/services/SettingsService";

export default defineBackground(() => {

  browser.runtime.onInstalled.addListener(async () => {
    const settings = await SettingsService.init();
    await buildPreferenceTable(settings.preferences);
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_PRODUCT_DATA") {
      const api = new OFFDataLayer(message.data);
      api.fetch()?.then((response) => {
        sendResponse(response);
      });
      return true;
    }
  });

  browser.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === "local" && changes["settings"]) {
      await buildPreferenceTable(changes["settings"].newValue as any);
      browser.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            browser.tabs.sendMessage(tab.id, {
              type: "SETTINGS_CHANGED",
              settings: changes["settings"].newValue,
            }).catch(() => {});
          }
        });
      });
    }
  });

});
