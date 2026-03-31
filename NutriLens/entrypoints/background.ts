import { OFFDataLayer } from "@/src/api/OFFDataLayer";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_PRODUCT_DATA") {
      const api = new OFFDataLayer(message.data);
      api.fetch()?.then((response) => {
        sendResponse(response);
      });
      return true;
    }
  });

  browser.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes["settings"]) {
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
