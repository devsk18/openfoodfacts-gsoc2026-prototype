import { I18n } from "@/src/i18n/I18n";
import { OFF_ICONS } from "../UI/offIcons";
import { OFF_LOGO } from "../UI/OffLogo";

interface ProductData {
  barcode?: string;
  nutriScore?: string;
  novaGroup?: string;
  ecoScore?: string;
  nutrients?: {
    fat?: string;
    saturated_fat?: string;
    sugars?: string;
    salt?: string;
  };
  showSearchWarning?: boolean;
  productName?: string;
}

export function Banner({ productData }: { productData: ProductData }) {

  return (
  <div class="mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm w-fit z-9999">
  <div class="flex items-center justify-between border-b border-gray-100 bg-gray-100 p-1">
    <div class="flex items-center gap-1.5">
      <div class="flex size-5 shrink-0 items-center justify-center">
        <img alt="OFF Light Logo" src={OFF_LOGO.ICON} />
      </div>
      {/* <span class="text-sm font-medium text-gray-700">NutriLens</span> */}
    </div>

    <div class="flex items-center gap-2">
      {productData.showSearchWarning && (
        <span class="cursor-pointer text-sm text-red-600 z-9999" title={I18n.t('searchWarningTitle')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
      )}
    </div>
  </div>

  <div>
    <div class="rounded-lg p-1">
      <div class="flex flex-row gap-1">
        <img class="h-7 w-auto" src={OFF_ICONS.resolveNutriScore(productData.nutriScore)} alt="" />
        <img class="h-7 w-auto" src={OFF_ICONS.resolveEcoScore(productData.ecoScore)} alt="" />
        <img class="h-7 w-auto" src={OFF_ICONS.resolveNova(productData.novaGroup?.toString())} alt="" />
      </div>
    </div>
  </div>
</div>
  );
}