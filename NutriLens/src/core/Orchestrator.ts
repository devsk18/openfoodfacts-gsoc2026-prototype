import { ProductViewBanner } from './../components/ProductViewBanner';
import { Adapter } from "./Adapter";
import { Renderer } from '../components/Renderer';
import { ListViewBanner } from '../components/ListViewBanner';
import { defaultSettings, Settings, SettingsService } from '../services/SettingsService';
import { I18n } from '../i18n/I18n';

const PROCESSED_ATTR = 'data-off-processed';

export class Orchestrator {
    private renderedElements = new Map<Element, Element>();
    private intersectionObservers = new Map<Element, IntersectionObserver>();
    private mutationObserver: MutationObserver | null = null;
    private debounceTimer: number | null = null;
    private settings: Settings = defaultSettings;
    
    constructor(private adapter: Adapter) {}

    async init() {
        await this.syncSettings();
        I18n.init(this.settings.language);
        this.initMutationObserver();
    }

    private async syncSettings() {
        const settings = await SettingsService.init();
        this.settings = settings;
    }

    render() {
        console.log('Orchestrator rendered');

        // product banner rendering
        if (this.settings?.showProduct) {
            this.renderProductBanner();
        }

        // list banner rendering
        if (this.settings?.showList) {
            this.renderListBanner();
        }
    }

    renderProductBanner() {
        if (this.adapter.doesProductItemExist()) {
            const productElement = this.adapter.getProductItemElement();
            if (!productElement || this.isProcessed(productElement)) return;
            this.markProcessed(productElement);
            
            const productData = this.adapter.getProductDataFromProductView(productElement);
            const container = this.adapter.injectProductBanner(productElement);
            Renderer.mount(ProductViewBanner, container, { data: productData });
            this.renderedElements.set(productElement, container);
        }
    }

    renderListBanner() {
        if (this.adapter.doesListItemExist()) {
            const listElements = this.adapter.getListItemElements();
            listElements.forEach((listElement) => {
                if (this.isProcessed(listElement)) return;
                
                if (this.isInViewPort(listElement)) {
                    this.markProcessed(listElement);
                    const listProductData = this.adapter.getProductDataFromListItem(listElement);
                    const container = this.adapter.injectListBanner(listElement);
                    Renderer.mount(ListViewBanner, container, { data: listProductData });
                    this.renderedElements.set(listElement, container);
                } else {
                    this.observeElement(listElement);
                }
            });
        }
    }

    async refresh() {
        this.clear();
        await this.syncSettings();
        this.render();
    }

    clear() {
        this.intersectionObservers.forEach((observer, element) => {
            observer.disconnect();
            element.removeAttribute(PROCESSED_ATTR);
        });
        this.intersectionObservers.clear();

        this.renderedElements.forEach((container, element) => {
            element.removeAttribute(PROCESSED_ATTR);
            Renderer.unmount(container);
        });
        this.renderedElements.clear();

        document.querySelectorAll(`[${PROCESSED_ATTR}]`)
            .forEach(el => el.removeAttribute(PROCESSED_ATTR));
    }

    initMutationObserver() {
        this.mutationObserver = new MutationObserver(mutations => {
            if (!mutations.some(m => m.addedNodes.length > 0)) return;
            
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = window.setTimeout(() => this.render(), 500);
        });
        
        this.mutationObserver.observe(document.body, { subtree: true, childList: true });
    }

    private observeElement(element: Element) {
        if (this.isProcessed(element) || this.intersectionObservers.has(element)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.isProcessed(element)) {
                    this.markProcessed(element);
                    
                    const container = this.adapter.injectListBanner(element);
                    if (!container) return;
                    
                    const listProductData = this.adapter.getProductDataFromListItem(element);
                    Renderer.mount(ListViewBanner, container, { data: listProductData });
                    this.renderedElements.set(element, container);
                    
                    observer.disconnect();
                    this.intersectionObservers.delete(element);
                }
            });
        });
        
        observer.observe(element);
        this.intersectionObservers.set(element, observer);
    }

    private isInViewPort(element: Element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= window.innerWidth) && ((rect.left + rect.width) >= 0);
        return (vertInView && horInView);
    }

    private isProcessed(element: Element): boolean {
        return element.hasAttribute(PROCESSED_ATTR);
    }

    private markProcessed(element: Element): void {
        element.setAttribute(PROCESSED_ATTR, 'true');
    }
}