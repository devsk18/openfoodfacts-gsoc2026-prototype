import { Adapter } from "../Adapter";

export class MetroAdapter extends Adapter {
    readonly hostname = "www.metro.ca";
    readonly sku_prefix = "metro-"; // use store_uuid when duckdb is ready
    readonly structure = {
        productView: {
            baseSelector: ".pdpDetailsContainer",
            uiInjectionElement: ".pdpDetailsContainer",
            barcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
        },
        listView: {
            baseSelector: ".default-product-tile",
            uiInjectionElement: ".pt__content--wrap",
            barcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
        },
    };
    
    constructor() {
        super();
    }

    doesProductItemExist() {
        return !!document.querySelector(this.structure.productView.baseSelector);
    }

    doesListItemExist() {
        return !!document.querySelector(this.structure.listView.baseSelector);
    }

    getProductItemElement(): Element {
        return document.querySelector(this.structure.productView.baseSelector)!;
    }
    
    getListItemElements(): Element[] {
        return Array.from(document.querySelectorAll(this.structure.listView.baseSelector));
    }

    // TODO: extract balance data from the element
    // TODO: create search query here itself
    getProductDataFromListItem(element: Element) {
        const barcode = this.structure.listView.barcode(element);
        const sku = this.sku_prefix + "sku";
        const name = "name";
        const brand = "brand";
        const size = "size";
        const image = "image";
        return { barcode, sku, name, brand, size, image };
    }

    getProductDataFromProductView(element: Element) {
        const barcode = this.structure.productView.barcode(element);
        const sku = this.sku_prefix + "sku";
        const name = "name";
        const brand = "brand";
        const size = "size";
        const image = "image";
        return { barcode, sku, name, brand, size, image };
    }

    injectProductBanner(target: Element): Element {
        // decide where to inject the banner in product view
        const host = this.getHostElement();
        target.before(host);
        return this.getShadowRootContainer(host);
    }

    injectListBanner(target: Element): Element {
        const anchor = target.querySelector(this.structure.listView.uiInjectionElement) ?? target;
        const host = this.getHostElement();
        // decide where to inject the banner in list view
        anchor.before(host);
        return this.getShadowRootContainer(host);
    }
}
