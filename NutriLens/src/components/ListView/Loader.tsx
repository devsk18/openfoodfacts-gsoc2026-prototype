import { OFF_LOGO } from "../UI/OffLogo";

export const Loader = () => {
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
          <div class="h-4 w-25 animate-pulse rounded-md bg-white"></div>
        </div>
      </div>

      <div>
        <div class="rounded-lg p-2">
          <div class="flex flex-row gap-2">
            <div class="h-9.5 w-20 animate-pulse rounded-md bg-gray-100"></div>
            <div class="h-9.5 w-20 animate-pulse rounded-md bg-gray-100"></div>
            <div class="h-9.5 w-20 animate-pulse rounded-md bg-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}