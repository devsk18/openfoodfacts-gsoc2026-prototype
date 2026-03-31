import OFFLogoIcon from '/off/off-logo-icon.svg';
import OFFLogoLight from '/off/off-logo-horizontal-light.svg';

const Header = () => {
  return (
      <header class="flex items-center justify-between px-4 py-3 w-full">
          <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shink-0">
                  <img src={OFFLogoIcon} className="w-full h-6 object-contain" alt="OFF Logo" />
              </div>
              <div>
                  <p class="text-lg font-semibold text-amber-600 leading-tight">NutriLens</p>
                  <p class="text-xs text-gray-500 leading-tight">Your Health Lens</p>
              </div>
          </div>
          <img src={OFFLogoLight} className="w-auto h-5 object-contain" alt="OFF Logo" />
      </header>
  )
}

export default Header