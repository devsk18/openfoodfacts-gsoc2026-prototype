import { useState, useEffect } from "preact/hooks";
import Toggle from "./ui/Toggle";
import PrefGroup from "./ui/PrefGroup";
import { defaultSettings, SettingsService, type Settings } from "../src/services/SettingsService";
import { I18n } from "@/src/i18n/I18n";

const Settings = ({ settings, onChange }: {
  settings: Settings;
  onChange: (s: Settings) => void;
}) => {
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const updatePreferences = (updates: Partial<Settings["preferences"]>) => {
    onChange({ ...settings, preferences: { ...settings.preferences, ...updates } });
  };

  const resetSettings = () => {
    onChange(defaultSettings);
  };

    return (

        <div class="w-90 bg-white rounded border  border-gray-100 overflow-hidden text-sm">

            {/* Scrollable styles */}
            {/* [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-[3px] */}
            <div class="pb-3 overflow-y-auto max-h-full no-scrollbar">

                {/* General */}
                <div class="px-4 pt-3 pb-1">
                    <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">{I18n.t('General')}</p>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-[13px] text-gray-800">{I18n.t('Language')}</span>
                        <select 
                            id="lang" 
                            value={settings.language}
                            onChange={(e) => updateSetting('language', (e.target as HTMLSelectElement).value as "en" | "fr")}
                            class="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 cursor-pointer">
                            <option value="en">English (EN)</option>
                            <option value="fr">Français (FR)</option>
                        </select>
                    </div>
                </div>

                <hr class="border-gray-100 my-1.5" />

                {/* Display */} 
                <div class="px-4 pt-2 pb-1">
                    <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">Display</p>

                    <div class="flex items-center justify-between py-1.5">
                        <div>
                            <p class="text-[13px] text-gray-800 m-0">{I18n.t('showProductBanner')}</p>
                            <p class="text-[11px] text-gray-400 mt-0.5">{I18n.t('ShowProductBannerDescription')}</p>
                        </div>
                        <Toggle on={settings.showProduct} onChange={(v) => updateSetting('showProduct', v)} />
                    </div>

                    <div class="flex items-center justify-between py-1.5">
                        <div>
                            <p class="text-[13px] text-gray-800 m-0">{I18n.t('showListBanner')}</p>
                            <p class="text-[11px] text-gray-400 mt-0.5">{I18n.t('ShowListBannerDescription')}</p>
                        </div>
                        <Toggle on={settings.showList} onChange={(v) => updateSetting('showList', v)} />
                    </div>
                </div>

                <hr class="border-gray-100 my-1.5" />

                {/* Preference Score */}
                <div class="px-4 pt-2">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="text-[13px] font-medium text-gray-800 m-0">{I18n.t('preferenceScore')}</p>
                            <p class="text-[11px] text-gray-400 mt-0.5">{I18n.t('SetYourPriorityLevelsForEachAttribute')}</p>
                        </div>
                        <Toggle on={settings.prefScore} onChange={(v) => updateSetting('prefScore', v)} />
                    </div>

                    <PrefGroup 
                        label={I18n.t('nutritionalQuality')} 
                        state={{
                            nutriScore: settings.preferences.nutriScore,
                            low_fat: settings.preferences.low_fat,
                            low_salt: settings.preferences.low_salt,
                            low_sugar: settings.preferences.low_sugar,
                            low_saturated_fat: settings.preferences.low_saturated_fat
                        }} 
                        onChange={(v) => updatePreferences(typeof v === 'function' ? v({
                            nutriScore: settings.preferences.nutriScore,
                            low_fat: settings.preferences.low_fat,
                            low_salt: settings.preferences.low_salt,
                            low_sugar: settings.preferences.low_sugar,
                            low_saturated_fat: settings.preferences.low_saturated_fat
                        }) : v)} 
                    />

                    <PrefGroup 
                        label={I18n.t('processing')} 
                        state={{ novaScore: settings.preferences.novaScore }} 
                        onChange={(v) => updatePreferences(typeof v === 'function' ? { novaScore: v({ novaScore: settings.preferences.novaScore }).novaScore } : { novaScore: v.novaScore })} 
                    />

                    <PrefGroup 
                        label={I18n.t('environment')} 
                        state={{ ecoScore: settings.preferences.ecoScore }} 
                        onChange={(v) => updatePreferences(typeof v === 'function' ? { ecoScore: v({ ecoScore: settings.preferences.ecoScore }).ecoScore } : { ecoScore: v.ecoScore })} 
                    />
                </div>

                <hr class="border-gray-100 my-1.5" />

                <div class="px-4 pt-3 pb-1">
                    <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">{I18n.t('settings')}</p>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-[13px] text-gray-800">{I18n.t('resetToDefaults')}</span>
                        <button
                            onClick={resetSettings}
                            class="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 cursor-pointer mt-2"
                        >
                            {I18n.t('resetToDefaults')}
                        </button>
                    </div>
                </div>

                

            </div>
        </div>
    );
};

export default Settings;