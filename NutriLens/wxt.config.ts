import { defineConfig } from "wxt";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [
      tailwindcss(),
      preact()
    ],
  }),
  manifest: {
    name: "NutriLens",
    description: "GSoC 2026 OFF #P5 prototype",
    host_permissions: [
      "https://world.openfoodfacts.org/*",
      "https://search.openfoodfacts.org/*",
    ],
    permissions: ["storage", "unlimitedStorage"],
  },
});

