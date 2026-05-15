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
  brand?: string | string[];
  image?: string;
  productQuantity?: number;
  productQuantityUnit?: string;
  searchScore?: number;
  preferenceScore?: number;
  preferenceLabel?: string;
  preferenceColor?: string;
}

function ScoreBadge({ scoreType, value }: { scoreType: "nutri" | "eco" | "nova"; value: string }) {
  const ICONS = {
    nutri: OFF_ICONS.resolveNutriScore,
    eco: OFF_ICONS.resolveEcoScore,
    nova: OFF_ICONS.resolveNova,
  };
  const descKey = `${scoreType}score_${value?.toLowerCase()}_short`;

  return (
    <div class="rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-left">
      <img class="h-10" src={ICONS[scoreType](value)} alt={`${scoreType} score`} />
      <p class="mt-2 text-xs font-semibold text-gray-600 leading-tight">{I18n.t(scoreType)}</p>
      {value && value !== 'unknown' && (
        <p class="mt-0.5 text-[10px] text-gray-500 leading-tight">{I18n.t(descKey)}</p>
      )}
    </div>
  );
}

function NutriRow({ label, level }: { label: string; level: string }) {
  const ICONS: Record<string, (level: string) => string> = {
    sugars: OFF_ICONS.sugar,
    fat: OFF_ICONS.fat,
    saturated_fat: OFF_ICONS.saturatedFat,
    salt: OFF_ICONS.salt,
  };

  const COLOR: Record<string, string> = {
    low: "bg-green-500",
    moderate: "bg-yellow-500",
    high: "bg-red-500",
    unknown: "bg-gray-300",
  };

  const WIDTH: Record<string, string> = {
    low: "w-1/4",
    moderate: "w-1/2",
    high: "w-3/4",
    unknown: "w-[12.5%]",
  };

  return (
    <div class="flex min-w-0 items-start gap-2 bg-gray-50 rounded-lg p-2.5">
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-1">
          <div class="flex items-center gap-1.5">
            <img src={ICONS[label](level)} class="h-4 w-4 shrink-0" alt={`${label} icon`} />
            <span class="truncate text-xs font-medium text-gray-700">{I18n.t(label)}</span>
          </div>
          <span class="text-xs font-normal whitespace-nowrap text-gray-500">{I18n.t(level)}</span>
        </div>
        <div class="mt-1.5 h-1 w-full rounded-full bg-gray-200">
          <div class={`h-full rounded-full ${COLOR[level]} ${WIDTH[level]}`} />
        </div>
      </div>
    </div>
  );
}

export function Banner({ data, close }: { data: ProductData; close: () => void }) {
  const [open, setOpen] = useState(true);
  const { barcode, nutriScore, novaGroup, ecoScore, nutrients, showSearchWarning } = data;

  const prefScore = data.preferenceScore ?? 0;
  const srchScore = data.searchScore ?? (showSearchWarning ? 80 : 100);

  return (
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm">

      {/* ── Header ── */}
      <div
        // onClick={() => setOpen(!open)}
        class="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-50 px-3.5 py-2.5"
      >
        <div class="flex h-5 w-28 shrink-0 items-center">
          <img alt="OFF Logo" src={OFF_LOGO.LIGHT} class="h-full w-auto" />
        </div>

        <div class="flex items-center gap-2">
          <button class="cursor-pointer btn btn-ghost btn-sm" onClick={close}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-500 hover:text-gray-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Collapsible body ── */}
      <div style={{ height: open ? 'auto' : '0', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.55, 0, 0.1, 1)' }}>
        <div class="p-1">
          {/* Search warning banner */}
          {showSearchWarning && (
            <div class="mx-3 mt-2 flex items-end gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-amber-500 shrink-0 mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-[11px] font-medium text-amber-700 leading-tight">{I18n.t("searchWarningTitle")}</p>
              </div>
            </div>
          )}

          {/* ── Product header ── */}
          <div class="flex items-start gap-3.5 px-4 py-3.5">
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

            <div class="flex-1 min-w-0">
              {data.brand && (
                <div class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  {Array.isArray(data.brand) ? data.brand.join(", ") : data.brand}
                </div>
              )}
              <div class="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5">
                {data.productName}
              </div>
              <div className="flex items-center gap-2">
                {data.barcode && (
                  <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-gray-400 shrink-0">
                      <path d="M2 4h2v16H2V4zm3 0h1v16H5V4zm2 0h2v16H7V4zm3 0h1v16h-1V4zm2 0h2v16h-2V4zm3 0h1v16h-1V4zm2 0h2v16h-2V4z" />
                    </svg>
                    <span class="text-[11px] font-mono text-gray-500 tracking-wide">{data.barcode}</span>
                  </div>
                )}
                {data.productQuantity && (
                  <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-gray-400 shrink-0">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                    </svg>
                    <span class="text-[11px] text-gray-500">
                      {data.productQuantity} {data.productQuantityUnit ?? ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Match scores ── */}
          <div class="grid grid-cols-2 divide-x divide-gray-100 border-y border-gray-100 mb-1">
            <div class="px-4 py-2.5 flex flex-col gap-1">
              <h6 class="text-[12px] font-medium text-gray-700">{I18n.t("searchMatch")}</h6>
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-gray-500">{I18n.t(showSearchWarning ? "similar_match" : "exact_match")}</span>
                <span class="text-[13px] font-semibold" style={{ color: showSearchWarning ? '#f59e0b' : '#008f44' }}>{srchScore}%</span>
              </div>
              <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div class={`h-full rounded-full transition-all ${showSearchWarning ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${srchScore}%` }} />
              </div>
            </div>

            <div class="px-4 py-2.5 flex flex-col gap-1">
              <h6 class="text-[12px] font-medium text-gray-700">{I18n.t("preferenceMatch")}</h6>
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-gray-500">{I18n.t(data.preferenceLabel || 'unknown_match')}</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-[13px] font-semibold"
                    style={{ color: data.preferenceColor ?? '#a0a0a0' }}
                  >
                    {prefScore}%
                  </span>
                </div>
              </div>
              <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  style={{
                    width: `${prefScore}%`,
                    backgroundColor: data.preferenceColor ?? '#a0a0a0',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Score badges ── */}
          <div class="grid grid-cols-3 gap-2 px-3 py-2">
            <ScoreBadge scoreType="nutri" value={nutriScore} />
            <ScoreBadge scoreType="nova" value={novaGroup.toString()} />
            <ScoreBadge scoreType="eco" value={ecoScore} />
          </div>

          {/* ── Nutrient rows ── */}
          <div class="grid grid-cols-2 gap-2 px-3 py-2">
            {Object.entries(nutrients).map(([key, value]) => (
              <NutriRow key={key} label={key} level={value} />
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div class="border-t border-gray-100 bg-gray-50 py-2 text-center">
          <a
            href={`https://world.openfoodfacts.org/product/${barcode}`}
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-medium text-blue-600 no-underline hover:text-blue-800"
          >
            {I18n.t("viewOnOFF")}
          </a>
        </div>
      </div>
    </div>
  );
}