import { ParsedProduct } from "../api/parser";
import { OFF_LOGO } from "../config/constants";
import { t } from "../i18n";
import { getPreferenceBadge } from "../utils/preferenceMatcher";
import { DEFAULT_SETTINGS, loadSettings } from "../config/settings";
import { AppSettings } from "../types";

export class CardComponent {
  // private settings: AppSettings;

  // private async loadSettings(): Promise<AppSettings> {
  //   return await loadSettings();
  // }

  // constructor() {
  //   this.loadSettings().then((settings) => {
  //     this.settings = settings;
  //   });
  // }


  renderLoader(): string {
    return `
            <div class="nutricop-pdp-loader">
                <div class="pdp-header">
                    <img src="${OFF_LOGO.LIGHT}" />
                    <span class="pdp-header-text">${t("loading")}</span>
                </div>
                <div class="pdp-shimmer-body">
                    <div class="pdp-shimmer-block"></div>
                    <div class="pdp-shimmer-block"></div>
                    <div class="pdp-shimmer-block"></div>
                </div>
            </div>
        `;
  }

  /**
   * PDP Not Found: Encourages user to add the product to the database
   */
  renderNotFound(barcode: string): string {
    const chevron = `<span class="nc-chevron"><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="24"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clip-rule="evenodd"/></svg></span>`;
    return `
        <div class="nc-pdp nc-pdp--open nc-pdp-notfound">
            <div class="nc-pdp-header nc-accordion-trigger" onclick="this.closest('.nc-pdp').classList.toggle('nc-pdp--open')">
                <img src="${OFF_LOGO.LIGHT}" alt="Open Food Facts" class="nc-off-logo" />
                <div class="nc-header-right">
                    <span class="nc-barcode">Product Not Found</span>
                    ${chevron}
                </div>
            </div>

            <div class="nc-accordion-body">
                <div class="nc-section nc-section--danger" style="border-bottom: none;">
                    <div class="nc-nf-body">
                        <div class="nc-nf-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <div class="nc-nf-text">
                            <div class="nc-nf-title">Product not found</div>
                            <div class="nc-nf-desc">
                                No data available for this barcode. Help the community by adding it to Open Food Facts.
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="nc-pdp-footer">
                    <a href="https://world.openfoodfacts.org/product/${barcode}" target="_blank">
                        Add this product to Open Food Facts →
                    </a>
                </div>
            </div>
        </div>
    `;
}

  /**
   * PDP Banner: High-impact display with labels
   */
  // renderBanner — driven by attribute_groups data

  infoIcon = (warning: string) => `
  <span class="nc-info-wrap">
    <button class="nc-info-btn" aria-label="Warning" onclick="this.parentElement.classList.toggle('nc-info--open')">
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path fill-rule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 9a1 1 0 0 1-1-1v-4a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1z" clip-rule="evenodd"/>
      </svg>
    </button>
    <span class="nc-info-tooltip">${warning}</span>
  </span>
`;

  renderBanner(
    product: ParsedProduct,
    settings: AppSettings = DEFAULT_SETTINGS,
    evaluation: any,
  ): string {
    const LEVEL_WIDTH: Record<string, string> = {
      low: "20%",
      moderate: "50%",
      high: "80%",
      unknown: "5%",
    };

    const LEVEL_COLOR: Record<string, string> = {
      low: "#4caf7d",
      moderate: "#f59e0b",
      high: "#ef4444",
      unknown: "#d1d5db",
    };

    try {
      const {
        nutritionalQuality,
        allergens,
        ingredients,
        foodProcessing,
        environment,
        labels,
      } = product;
      const ns = nutritionalQuality.nutriScore;

      const chevron = `<span class="nc-chevron"><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="24"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clip-rule="evenodd"/></svg></span>`;
      const sectionToggle = `onclick="this.closest('.nc-section').classList.toggle('nc-section--open')"`;

      const preferenceBadge = getPreferenceBadge(evaluation);

      // <span class="nc-barcode">${product.barcode}</span>

      return `
<div class="nc-pdp ${settings.pdp.openByDefault ? "nc-pdp--open" : ""}">

  <!-- Header becomes the toggle trigger -->
  <div class="nc-pdp-header nc-accordion-trigger" onclick="this.closest('.nc-pdp').classList.toggle('nc-pdp--open')">
    <img src="${OFF_LOGO.LIGHT}" class="nc-off-logo" />
    <div class="nc-header-right">
      ${preferenceBadge}
      ${chevron}
    </div>
  </div>

  <div class="nc-accordion-body">

  ${
    settings.pdp.sections.nutritionalQuality
      ? `
  <div class="nc-section nc-section--open">
    <div class="nc-section-body">
    <div class="nc-proc-grid new-grid">
      ${
        ns
          ? `
      <div class="nc-nutriscore-row d-block" title="${ns.title} - ${ns.descriptionShort}">
        <img src="${ns.iconUrl}" class="nc-nutriscore-img" />
        <div class="nc-nutriscore-meta">
          <span class="nc-ns-title">${ns.title}</span>
          <span class="nc-ns-desc">${ns.descriptionShort}</span>
        </div>
      </div>`
          : ""
      }

      ${
        foodProcessing.nova
          ? `
      <div class="nc-nutriscore-row d-block" title="${foodProcessing.nova.name} - ${foodProcessing.nova.title}">
        <img src="${foodProcessing.nova.iconUrl}" class="nc-nutriscore-img" />
        <div class="nc-nutriscore-meta">
          <span class="nc-ns-title">${foodProcessing.nova.name}</span>
          <span class="nc-ns-desc">${foodProcessing.nova.title}</span>
        </div>
      </div>`
          : ""
      }

      ${
        environment.ecoScore
          ? `
      <div class="nc-nutriscore-row d-block" title="${environment.ecoScore.title} - ${environment.ecoScore.descriptionShort}">
        <img src="${environment.ecoScore.iconUrl}" class="nc-nutriscore-img" />
        <div class="nc-nutriscore-meta">
          <span class="nc-ns-title">${environment.ecoScore.title}</span>
          <span class="nc-ns-desc">${environment.ecoScore.descriptionShort}</span>
        </div>
      </div>`
          : ""
      }

    </div>
      <div class="nc-nutrients">
        ${nutritionalQuality.nutrients
          .map(
            (n) => `
          <div class="nc-nutrient" title="${n.title}">
            <div class="nc-nutrient-head">
              <img src="${n.iconUrl}" class="nc-nutrient-icon" />
              <span class="nc-nutrient-name">${n.name}</span>
              <span class="nc-nutrient-qty">${n.descriptionShort}</span>
            </div>
            <div class="nc-bar-track">
              <div class="nc-bar-fill" style="width:${LEVEL_WIDTH[n.level]};background:${LEVEL_COLOR[n.level]}"></div>
            </div>
            <span class="nc-nutrient-level-desc">${n.title}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </div>
  `
      : ""
  }

  <!-- Footer -->
  <div class="nc-pdp-footer">
    <a href="https://world.openfoodfacts.org/product/${product.barcode}" target="_blank">
      ${t("viewFullReport")} ↗
    </a>
  </div>

</div>

  
</div>
    `;
    } catch (err) {
      console.error("Error rendering banner:", err);
      return "";
    }
  }
}
