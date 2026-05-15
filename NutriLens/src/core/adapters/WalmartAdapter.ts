import { Adapter } from "../Adapter";

export class WalmartAdapter extends Adapter {
    readonly hostname = "www.walmart.ca";
    readonly sku_prefix = "walmart-"; // use store_uuid when duckdb is ready
    readonly structure = {
        productView: {
            baseSelector: "//*[@id='maincontent']/section/main/div[2]/div[2]/div",
            uiInjectionElement: "//*[@id='maincontent']/section/main/div[2]/div[2]/div/div[2]/div/div[1]",
            name: "#main-title",
            brand: "a[data-seo-id='brand-name']",
            barcode: null,
        },
        listView: {
            baseSelector: "div[data-item-id]",
            uiInjectionElement: "div:nth-of-type(3)",
            name: "a[data-dca-id] h3",
            barcode: null,
            sku: "data-dca-id",
        },
    };
    
    constructor() {
        super();
    }

    doesProductItemExist() {
        return !!this.selectXPath(this.structure.productView.baseSelector);
    }

    doesListItemExist() {
        return !!this.select(this.structure.listView.baseSelector);
    }

    getProductItemElement(): Element | null{
        return this.selectXPath(this.structure.productView.baseSelector);
    }
    
    getListItemElements(): Element[] {
        return this.selectAll(this.structure.listView.baseSelector);
    }

    // TODO: extract balance data from the element
    // TODO: create search query here itself
    getProductDataFromListItem(element: Element) {
        const barcode = null;
        const sku = element.getAttribute(this.structure.listView.sku);
        const name = this.select(this.structure.listView.name, element)?.textContent ?? null;
        const brand = "brand";
        const size = "size";
        const image = "image";
        const query = this.select(this.structure.listView.name, element)?.textContent ?? null;
        return { barcode, sku, name, brand, size, image, query };
    }

    getProductDataFromProductView(element: Element) {
        const script = this.select('script[type="application/ld+json"][data-seo-id="schema-org-product"]');
        if (!script) return null;
        const json = JSON.parse(script.textContent);

        if (json) {
            return {
                barcode: json['gtin13'] ?? null,
                sku: json['sku'] ?? null,
                name: json['name'] ?? null,
                brand: json['brand']['name'] ?? null,
                size: json['size'] ?? null,
                image: json['image'] ?? null,
                query: json['name'] ?? null
            }
        }

        return {
            barcode: null,
            sku: null,
            name: this.select(this.structure.productView.name)?.textContent ?? null,
            brand: this.select(this.structure.productView.brand)?.textContent ?? null,
            size: null,
            image: null,
            query: this.select(this.structure.productView.name)?.textContent ?? null,
        }
    }

    injectProductBanner(target: Element): Element {
        // decide where to inject the banner in product view
        const host = this.getHostElement();
        const anchor = this.selectXPath(this.structure.productView.uiInjectionElement);
        anchor?.before(host);
        return this.getShadowRootContainer(host);
    }

    injectListBanner(target: Element): Element {
        const anchor = this.select(this.structure.listView.uiInjectionElement, target) ?? target;
        const host = this.getHostElement();
        // decide where to inject the banner in list view
        anchor.after(host);
        return this.getShadowRootContainer(host);
    }

}
