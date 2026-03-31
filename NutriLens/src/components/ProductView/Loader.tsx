import { I18n } from "@/src/i18n/I18n";
import { OFF_LOGO } from "../UI/OffLogo";
import ShimmerBlock from "../UI/ShimmerBlock";

export const Loader = () => {
  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm mb-6">
        <div class="flex items-center justify-between border-b border-gray-100 bg-gray-100 px-3.5 py-2.5">
          <div class="flex items-center gap-1.5">
            <div class="flex h-12 w-60 shrink-0 items-center justify-center">
              <img alt="OFF Light Logo" src={OFF_LOGO.LIGHT} />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xl text-gray-400">{I18n.t("loading")}</span>
          </div>
        </div>
        <div class="flex gap-4 py-6 px-4">
          <ShimmerBlock />
          <ShimmerBlock />
          <ShimmerBlock />
        </div>
      </div>
    </div>
  );
};