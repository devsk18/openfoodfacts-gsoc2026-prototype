import { I18n } from "@/src/i18n/I18n";
import { OFF_ICONS } from "../UI/offIcons";
import { OFF_LOGO } from "../UI/OffLogo";

interface ProductData {
  barcode?: string;
  nutriScore?: string;
  novaGroup?: string;
  ecoScore?: string;
  nutrients?: { fat?: string; saturated_fat?: string; sugars?: string; salt?: string; };
  showSearchWarning?: boolean;
  productName?: string;
  productQuantity?: string;
  productQuantityUnit?: string;
  preferenceScore?: number;
  preferenceLabel?: string;
  preferenceColor?: string;
}

interface ListBannerProps {
  productData: ProductData;
  loading?: boolean;
  notFound?: boolean;
  onClick?: () => void;
}

export function ListBanner({ productData, loading, notFound, onClick }: ListBannerProps) {

  const handleClick = (e: MouseEvent) => {
    // Only stop propagation on the banner itself — don't let it bubble up to the anchor
    e.stopPropagation();
    e.preventDefault();
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      title={productData.showSearchWarning ? I18n.t('searchWarningTitle') : ''}
      class="mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white
             text-base shadow-sm w-fit cursor-pointer
             transition-colors duration-150 hover:border-blue-200 hover:shadow-blue-50"
    >
      {/* Header */}
      <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-2 py-1 gap-2">
        <div class="flex items-center gap-1.5">
          <img alt="OFF Logo" src={OFF_LOGO.ICON} class="size-4 shrink-0" />
          <span class="text-[10px] font-medium text-gray-400 tracking-wide">NutriLens</span>
        </div>
        <div class="flex items-center gap-1.5">
          {productData.showSearchWarning && (
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3.5 text-amber-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
          )}
          {/* Tap hint icon */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke-width="1.5" stroke="currentColor" class="size-3 text-gray-300">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg> */}
        </div>
      </div>

      {/* Score icons */}
      <div class="flex items-center gap-1.5 px-2 py-1.5">
        {loading
          ? <div class="flex items-center gap-1.5">
            <div class="h-6 w-7 rounded bg-gray-200 animate-pulse" />
            <div class="h-6 w-7 rounded bg-gray-200 animate-pulse" />
            <div class="h-6 w-7 rounded bg-gray-200 animate-pulse" />
          </div>
          : notFound
            ? <span class="text-[10px] text-gray-400 px-1">Not found</span>
            : <>
              <img class="h-6 w-auto" src={OFF_ICONS.resolveNutriScore(productData.nutriScore)} alt="Nutri-Score" />
              <img class="h-6 w-auto" src={OFF_ICONS.resolveEcoScore(productData.ecoScore)} alt="Eco-Score" />
              <img class="h-6 w-auto" src={OFF_ICONS.resolveNova(productData.novaGroup?.toString())} alt="NOVA" />
            </>
        }
      </div>

      {(productData.preferenceScore != null) && (
        <div class="px-2 pb-1.5 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <div class="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                style={{
                  width: `${productData.preferenceScore}%`,
                  backgroundColor: productData.preferenceColor ?? '#a0a0a0',
                }}
              />
            </div>
            <span
              class="text-[10px] font-semibold shrink-0"
              style={{ color: productData.preferenceColor ?? '#a0a0a0' }}
            >
              {productData.preferenceScore}%
            </span>
          </div>
          <span
            class="text-[10px] leading-none"
            style={{ color: productData.preferenceColor ?? '#a0a0a0' }}
          >
            {I18n.t(productData.preferenceLabel || 'unknown_match')}
          </span>
        </div>
      )}
    </div>
  );
}