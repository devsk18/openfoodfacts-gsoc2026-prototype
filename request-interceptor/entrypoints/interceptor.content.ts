/**
 *  Flow of extraction:
 *  1. configure new hostname and it's url patterns
 *  2. Parse and extract required data based on the hostname
 *  3. Send the data to the background script for mapping submission
 */

interface SiteConfig {
  hostname: string | RegExp;
  patterns: RegExp[];
}

const SITES: SiteConfig[] = [
  {
    hostname: /loblaws\.ca$/, // regex covers www.loblaws.ca + any subdomain
    patterns: [
      /api\.pcexpress\.ca\/pcx-bff\/api\/v1\/products\/[^?#]+/,
      /api\.pcexpress\.ca\/pcx-bff\/api\/v1\/loblaw\/products\/[^?#]+\/recommendations/,
      //   /api\.pcexpress\.ca\/pcx-bff\/api\/v1\/sponsored-products/,  // barcode missing
    ],
  },
  {
    hostname: /costco\.ca$/,
    patterns: [/search\.costco\.ca\/api\/apps\//],
  }
  /* {
    hostname: /walmart\.ca$/,
    patterns: [
      /walmart\.ca\/api\/product\//,
    ],
  }, */
];

export default defineContentScript({
  matches: [
    "*://*.loblaws.ca/*",
    "*://*.costco.ca/*",
    // add new hostname here
  ],
  world: "MAIN",
  runAt: "document_start",

  main() {
    const host = window.location.hostname;

    const config = SITES.find((s) =>
      typeof s.hostname === "string"
        ? s.hostname === host
        : s.hostname.test(host),
    );

    if (!config) {
      console.warn(`[Interceptor] ⚠ no config matched for hostname: "${host}"`);
      return;
    }

    console.log(
      `[Interceptor] ✓ active on "${host}" — ${config.patterns.length} pattern(s)`,
    );

    function shouldLog(url: string): boolean {
      return config!.patterns.some((p) => p.test(url));
    }

    // handle fetch
    const _fetch = window.fetch.bind(window);

    window.fetch = async function (input, init) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : (input as Request).url;

      const method = (init?.method ?? "GET").toUpperCase();
      const response = await _fetch(input, init);

      if (shouldLog(url)) {
        response
          .clone()
          .json()
          .then((body: unknown) => {
            console.log(`[fetch] ${method} ${url}`, {
              status: response.status,
              body,
            });
            // fn call to handle data
          })
          .catch(() => {
            response
              .clone()
              .text()
              .then((text) => {
                console.log(`[fetch] ${method} ${url}`, {
                  status: response.status,
                  body: text,
                });
                // fn call to handle data
              });
          });
      }

      return response;
    };

    // handle XHR
    type PatchedXHR = XMLHttpRequest & { _iUrl?: string; _iMethod?: string };

    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      this: PatchedXHR,
      method: string,
      url: string | URL,
      ...rest: [boolean?, string?, string?]
    ) {
      this._iMethod = method.toUpperCase();
      this._iUrl = url.toString();
      return _open.apply(this, [method, url, ...rest] as Parameters<
        typeof _open
      >);
    };

    XMLHttpRequest.prototype.send = function (this: PatchedXHR, body?) {
      if (shouldLog(this._iUrl ?? "")) {
        this.addEventListener("load", function (this: PatchedXHR) {
          let parsed: unknown;
          try {
            parsed = JSON.parse(this.responseText);
          } catch {
            parsed = this.responseText;
          }
          console.log(`[xhr] ${this._iMethod} ${this._iUrl}`, {
            status: this.status,
            body: parsed,
          });
          // fn call to handle data
        });
      }
      return _send.call(this, body);
    };
  },
});
