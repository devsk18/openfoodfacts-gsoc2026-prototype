// components/ProductView/NotFound.tsx
import { OFF_LOGO } from "../UI/OffLogo";
import { I18n } from "@/src/i18n/I18n";

export function NotFound({ barcode, close }: { barcode: string, close: () => void }) {
  return (
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div class="flex items-center justify-between gap-1.5 border-b border-gray-100 bg-gray-50 px-3.5 py-2.5">
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

      {/* Body */}
      <div class="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
            {barcode && (
                <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-gray-400 shrink-0">
                    <path d="M2 4h2v16H2V4zm3 0h1v16H5V4zm2 0h2v16H7V4zm3 0h1v16h-1V4zm2 0h2v16h-2V4zm3 0h1v16h-1V4zm2 0h2v16h-2V4z" />
                </svg>
                <span class="text-[11px] font-mono text-gray-500 tracking-wide">{barcode}</span>
                </div>
            )}
          <p class="text-sm font-semibold text-gray-700">{I18n.t("notFoundTitle")}</p>
          <p class="mt-1 text-xs text-gray-400 leading-relaxed">
            {I18n.t("notFoundDescription")}
          </p>
        </div>
        <a
          href="https://world.openfoodfacts.org/contribute"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-1 text-xs font-medium text-blue-600 no-underline hover:text-blue-800"
        >
          {I18n.t("contributeToOFF")}
        </a>
      </div>
    </div>
  );
}