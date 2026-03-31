import tailwindStyles from "../../assets/tailwind.css?inline";

export abstract class Adapter {
    abstract readonly hostname: string;
    abstract readonly structure: any;

    private static sharedSheet: CSSStyleSheet | null = null;

    constructor() {
        if (!Adapter.sharedSheet) {
            Adapter.sharedSheet = new CSSStyleSheet();

            const styles = tailwindStyles
                .split('\n')
                .filter(line => !line.trimStart().startsWith('@import'))
                .join('\n');

            Adapter.sharedSheet.replace(styles);

            if (!document.querySelector('#off-outfit-font')) {
                const link = document.createElement('link');
                link.id = 'off-outfit-font';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
                document.head.appendChild(link);
            }
        }
    }

    // Existence check methods
    abstract doesProductItemExist(): boolean;
    abstract doesListItemExist(): boolean;

    // Element retrieval methods
    abstract getListItemElements(): Element[];
    abstract getProductItemElement(): Element;

    // Banner injection methods
    abstract injectProductBanner(element: Element): Element;
    abstract injectListBanner(element: Element): Element;

    // Product data extraction methods
    abstract getProductDataFromListItem(element: Element): any;
    abstract getProductDataFromProductView(element: Element): any;

    protected getHostElement(): Element {
        const host = document.createElement('div');
        host.dataset.offBannerProcessed = 'true';
        return host;
    }

    protected getShadowRootContainer(host: Element): HTMLElement {
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const container = document.createElement('div');

        shadowRoot.adoptedStyleSheets = [Adapter.sharedSheet!];
        shadowRoot.appendChild(container);

        return container;
    }
}