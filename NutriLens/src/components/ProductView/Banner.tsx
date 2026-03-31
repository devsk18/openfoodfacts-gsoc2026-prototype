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
      <img class="h-14" src={iconPath} alt={`${scoreType} score icon`} />

      <div class="mt-2 flex flex-col gap-1">
        <p class="text-2xl leading-tight font-semibold text-gray-700">{I18n.t(scoreType)} {value.toUpperCase()}</p>
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
    <div class="flex min-w-0 items-start gap-2 bg-gray-100 rounded-lg p-3">
      <div class="mt-0.5 h-6 w-6 shrink-0">
        <img src={iconPath} alt={`${label} icon`} />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-1">
          <span class="truncate text-xl font-semibold text-gray-700">{I18n.t(label)}</span>
          {/* <span class="text-[10px] font-medium whitespace-nowrap text-gray-500">1g / 100g</span> */}
          <span class="text-lg font-medium whitespace-nowrap text-gray-500">{I18n.t(level)}</span>
        </div>
        <div class="my-1.5 h-2 w-full rounded-full bg-gray-200">
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

  return (
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm mb-6">
      <div onClick={() => setOpen(!open)} class="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-100 px-3.5 py-2.5">
        <div class="flex items-center gap-1.5">
          <div class="flex h-12 w-60 shrink-0 items-center justify-center">
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
        <div class="p-3 rounded-lg">
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
          <a href={`https://world.openfoodfacts.org/product/${barcode}`} target="_blank" rel="noopener noreferrer" class="text-lg font-medium text-blue-600 no-underline">{I18n.t("viewOnOFF")}</a>
        </div>
      </div>
    </div>
  );
}








