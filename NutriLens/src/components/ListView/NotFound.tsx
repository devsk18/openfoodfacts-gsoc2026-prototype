import { OFF_LOGO } from "../UI/OffLogo";

export const NotFound = () => {
  return (
    <div class="mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 bg-gray-100 p-1">
        <div class="flex items-center gap-1.5">
          <div class="flex h-5 w-5 shrink-0 items-center justify-center">
            <img alt="OFF Light Logo" src={OFF_LOGO.ICON} />
          </div>
          <span class="text-sm text-red-600">Product Not Found</span>
        </div>
      </div>
    </div>
  );
}