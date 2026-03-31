import '../../assets/tailwind.css';
import { render } from 'preact';
import { useState, useEffect } from "preact/hooks";
import { I18n } from "@/src/i18n/I18n";
import { SettingsService, defaultSettings, Settings } from "@/src/services/SettingsService";
import Header from '../../components/Header';
import SettingsComponent from '@/components/Settings';

function Popup({ settings, onSettingsChange }: {
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
}) {
  return (
    <div class="flex flex-col items-center p-4 bg-gray-50 shadow w-96 h-128">
      <Header />
      <SettingsComponent settings={settings} onChange={onSettingsChange} />
    </div>
  );
}

function Root() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SettingsService.init().then((saved) => {
      I18n.init(saved.language);
      setSettings(saved);
      setReady(true);
    });

    const handler = (message: any) => {
      if (message.type === "SETTINGS_CHANGED" && message.settings) {
        I18n.init(message.settings.language);
        setSettings(message.settings);
      }
    };

    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  }, []);

  const handleSettingsChange = (updated: Settings) => {
    setSettings(updated);
    SettingsService.getInstance().set(updated);

    // re-init i18n if language changed
    if (updated.language !== settings.language) {
      I18n.init(updated.language);
    }
  };

  if (!ready) return null;
  return <Popup key={settings.language} settings={settings} onSettingsChange={handleSettingsChange} />;
}

render(<Root />, document.getElementById("root")!);