import { useState } from "preact/hooks";
import { I18n } from "@/src/i18n/I18n";
import { OFF_LOGO } from "../UI/OffLogo";
import ChevronIcon from "../UI/ChevronIcon";
import { OFF_ICONS } from "../UI/offIcons";

interface ProductData {
  barcode: string;
  nutriScore: string;
  novaGroup: string | number;
  ecoScore: string;
  nutrients: {
    fat: string;
    saturated_fat: string;
    sugars: string;
    salt: string;
  };
  showSearchWarning: boolean;
  productName?: string;
  brand?: string;
  image?: string;
  searchScore?: number;
  preferenceScore?: number;
}

function ScoreBadge({ scoreType, value }: { scoreType: "nutri" | "eco" | "nova"; value: string }) {
  const ICONS = {
    "nutri": OFF_ICONS.resolveNutriScore,
    "eco": OFF_ICONS.resolveEcoScore,
    "nova": OFF_ICONS.resolveNova
  };
  const iconPath = ICONS[scoreType](value);
  return (
    <div class="rounded-lg border border-gray-200 bg-gray-100 p-3 text-left">
      <img class="h-10" src={iconPath} alt={`${scoreType} score icon`} />

      <div class="mt-2 flex flex-col gap-1">
        <p class="text-sm leading-tight font-semibold text-gray-700">{I18n.t(scoreType)}</p> {/* {value.toUpperCase()} */}
        {/* <p class="text-lg leading-tight font-medium text-gray-500">{I18n.t(value)}</p> */}
      </div>
    </div>
  );
}


function NutriRow({ label, level }: { label: string; level: string }) {
  const ICONS: Record<string, (level: string) => string> = {
    "sugars": OFF_ICONS.sugar,
    "fat": OFF_ICONS.fat,
    "saturated_fat": OFF_ICONS.saturatedFat,
    "salt": OFF_ICONS.salt
  };

  const COLOR: Record<string, string> = {
    "low": "bg-green-500",
    "moderate": "bg-yellow-500",
    "high": "bg-red-500",
    "unknown": "bg-gray-500"
  }

  const WIDTH: Record<string, string> = {
    "low": "w-1/4",
    "moderate": "w-1/2",
    "high": "w-3/4",
    "unknown": "w-1/8"
  }

  const iconPath = ICONS[label](level);
  return (
    <div class="flex min-w-0 items-start gap-2 bg-gray-100 rounded-lg p-2">
      {/* <div class="mt-0.5 h-4 w-4 shrink-0">
        <img src={iconPath} alt={`${label} icon`} />
      </div> */}

      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-1">
          <div class="flex items-center">
            <img src={iconPath} class="h-4 w-4 shrink-0" alt={`${label} icon`} />
            <span class="ml-2 truncate text-sm font-medium text-gray-700">{I18n.t(label)}</span>
          </div>
          {/* <span class="text-[10px] font-medium whitespace-nowrap text-gray-500">1g / 100g</span> */}
          <span class="text-xs font-normal whitespace-nowrap text-gray-500">{I18n.t(level)}</span>
        </div>
        <div class="my-1.5 h-1 w-full rounded-full bg-gray-200">
          <div class={`h-full rounded-full ${COLOR[level]} ${WIDTH[level]}`}></div>
        </div>
        {/* <p class="text-lg leading-tight font-medium text-gray-400">{I18n.t(level)} {I18n.t("quantity")}</p> */}
      </div>
    </div>
  );
}

// TODO: need to move components to separate files
export function Banner({ data }: { data: ProductData }) {
  const [open, setOpen] = useState(true);

  const { barcode, nutriScore, novaGroup, ecoScore, nutrients, showSearchWarning } = data;
  data.searchScore = 85;
  data.preferenceScore = 70;

  return (
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm">
      <div onClick={() => setOpen(!open)} class="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-100 px-3.5 py-2.5">
        <div class="flex items-center gap-1.5">
          <div class="flex h-6 w-32 shrink-0 items-center justify-center">
            <img alt="OFF Light Logo" src={OFF_LOGO.LIGHT} />
          </div>
        </div>

        <div class="flex items-center gap-2">
          {data?.productName && (
            <span class="rounded-full border border-gray-400 px-2 py-0.5 text-[10px] text-gray-600" title="Product name">{I18n.t("product")}: {data.productName}</span>
          )}
          {showSearchWarning && (
              <span class="rounded-full border border-amber-400 px-2 py-0.5 text-[10px] text-amber-600" title={I18n.t("searchWarningTitle")}>{I18n.t("searchWarning")}</span>
            )}
          {/* <span class="rounded-full border border-red-500 px-2 py-0.5 text-[11px] text-red-600">Poor match 31%</span> */}
          <ChevronIcon open={open} />
        </div>
      </div>
      
      <div style={{ height: open ? 'auto' : '0', overflow: 'hidden', transition: 'all 0.5s cubic-bezier(0.55, 0, 0.1, 1)' }}>
        <div class="p-1 rounded-lg">

          {/* Product Header */}
          <div class="flex items-start gap-3.5 px-4 py-3.5">

            {/* Image */}
            <div class="shrink-0 size-18 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
              {data.image
                ? <img src={data.image} alt="Product" class="size-full object-contain p-1" />
                : <div class="size-full flex items-center justify-center text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              }
            </div>

            {/* Text */}
            <div class="flex-1 min-w-0">
              {data.brand && (
                <div class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  {data.brand}
                </div>
              )}
              <div class="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5">
                {data.productName}
              </div>
              {data.barcode && (
                <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-gray-400 shrink-0">
                    <path d="M2 4h2v16H2V4zm3 0h1v16H5V4zm2 0h2v16H7V4zm3 0h1v16h-1V4zm2 0h2v16h-2V4zm3 0h1v16h-1V4zm2 0h2v16h-2V4z" />
                  </svg>
                  <span class="text-[11px] font-mono text-gray-500 tracking-wide">{data.barcode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Match Scores */}
          <div class="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">

            {/* Search match */}
            <div class="px-4 py-2.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-gray-500">Search match</span>
                <span class="text-[13px] font-semibold text-blue-700">{data.searchScore}%</span>
              </div>
              <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${data.searchScore}%` }}
                />
              </div>
            </div>

            {/* Preference match */}
            <div class="px-4 py-2.5 flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-gray-500">Preference match</span>
                <span class={`text-[13px] font-semibold ${data.preferenceScore >= 75 ? 'text-green-700' :
                    data.preferenceScore >= 50 ? 'text-amber-700' : 'text-red-700'
                  }`}>{data.preferenceScore}%</span>
              </div>
              <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class={`h-full rounded-full transition-all ${data.preferenceScore >= 75 ? 'bg-green-500' :
                      data.preferenceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${data.preferenceScore}%` }}
                />
              </div>
            </div>

          </div>

          <div class="grid grid-cols-3 gap-3 px-3 py-2">
            <ScoreBadge scoreType="nutri" value={nutriScore} />
            <ScoreBadge scoreType="nova" value={novaGroup.toString()} />
            <ScoreBadge scoreType="eco" value={ecoScore} />
          </div>

          <div class="grid grid-cols-1 gap-x-4 gap-y-3 px-3 py-2 sm:grid-cols-2">
            {Object.entries(nutrients).map(([key, value]) => (
              <NutriRow label={key} level={value} />
            ))}
          </div>
        </div>
        <div class="border-t border-gray-100 bg-gray-100 py-2 text-center">
          <a href={`https://world.openfoodfacts.org/product/${barcode}`} target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-blue-600 no-underline">{I18n.t("viewOnOFF")}</a>
        </div>
      </div>
    </div>
  );
}








