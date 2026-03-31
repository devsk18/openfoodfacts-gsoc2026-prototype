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
    <div class="mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm">
  <div class="flex items-center justify-between border-b border-gray-100 bg-gray-100 p-1">
    <div class="flex items-center gap-1.5">
      <div class="flex h-4 w-4 shrink-0 items-center justify-center">
        <img alt="OFF Light Logo" src={OFF_LOGO.ICON} />
      </div>
      <span class="text-sm font-medium text-gray-700">NutriLens</span>
    </div>

    <div class="flex items-center gap-2">
      {productData.showSearchWarning && (
        <span class="cursor-pointer text-sm text-red-600" title={I18n.t('searchWarningTitle')}>{I18n.t('searchWarningList')}</span>
      )}
    </div>
  </div>

  <div>
    <div class="rounded-lg p-2 pt-1">
      <div class="flex flex-row gap-2">
        <img class="h-11 w-auto" src={OFF_ICONS.resolveNutriScore(productData.nutriScore)} alt="" />
        <img class="h-11 w-auto" src={OFF_ICONS.resolveEcoScore(productData.ecoScore)} alt="" />
        <img class="h-11 w-auto" src={OFF_ICONS.resolveNova(productData.novaGroup?.toString())} alt="" />
      </div>
    </div>
  </div>
</div>
  );
}