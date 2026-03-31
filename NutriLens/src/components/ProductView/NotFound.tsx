import { useState } from 'preact/hooks';
import { OFF_LOGO } from '../UI/OffLogo';
import ChevronIcon from '../UI/ChevronIcon';
import { I18n } from '@/src/i18n/I18n';


export const NotFound = ({ barcode = "" }: { barcode?: string }) => {
  // const [open, setOpen] = useState(true);

  return (
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm mb-6">
      <div class="flex items-center justify-between border-b border-gray-100 bg-gray-100 px-3.5 py-2.5">
        <div class="flex items-center gap-1.5">
          <div class="flex h-12 w-60 shrink-0 items-center justify-center">
            <img alt="OFF Light Logo" src={OFF_LOGO.LIGHT} />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="rounded-full border border-red-500 px-2 py-0.5 text-[11px] text-red-600">{I18n.t("productNotFound")}</span>
          {/* <ChevronIcon open={open} /> */}
        </div>
      </div>
      
      {/* <div style={{ height: open ? 'auto' : '0', overflow: 'hidden', transition: 'all 0.5s cubic-bezier(0.55, 0, 0.1, 1)' }}>
        <div class="p-3 rounded-lg">
          <div class="grid grid-cols-3 gap-3 px-3 py-2">

          </div>

          <div class="grid grid-cols-1 gap-x-4 gap-y-3 px-3 py-2 sm:grid-cols-2">
           
          </div>
        </div>
        <div class="border-t border-gray-100 bg-gray-100 py-2 text-center">
          <a href={`https://world.openfoodfacts.org/product/${barcode}`} target="_blank" rel="noopener noreferrer" class="text-lg font-medium text-blue-600 no-underline">{I18n.t("viewOnOFF")}</a>
        </div>
      </div> */}
    </div>
  );
};