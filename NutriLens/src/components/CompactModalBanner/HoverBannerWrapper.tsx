import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import { createPortal } from "preact/compat";
import { ListBanner } from "./ListBanner";
import { Banner } from "./Banner";
// import { Loader } from "../ProductView/Loader";
// import { NotFound } from "../ProductView/NotFound";
import { OFF_LOGO } from "../UI/OffLogo";
import { Loader } from "./Loader";
import { NotFound } from "./NotFound";

interface Props {
  data: any;
}

export function HoverBannerWrapper({ data }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const portalContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const host = document.createElement('div');
    host.setAttribute('data-nutrilens-modal', 'true');
    host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    container.style.cssText = 'height:100%;';
    shadow.appendChild(container);

    const existingSheets = document.querySelector('[data-off-banner-processed]')
      ?.shadowRoot?.adoptedStyleSheets ?? [];
    if (existingSheets.length) shadow.adoptedStyleSheets = existingSheets;

    portalContainerRef.current = container;
    return () => host.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    browser.runtime.sendMessage({ type: 'FETCH_PRODUCT_DATA', data })
      .then((res) => {
        if (cancelled) return;
        if (!res) { setNotFound(true); return; }
        setProduct(res);
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleBannerClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const modalContent = () => {
    if (loading) return <Loader />;
    if (notFound) return <NotFound barcode={data.barcode} close={closeModal}/>;
    if (!product) return null;
    return <Banner data={product} close={closeModal}/>;
  };

  const modal = modalOpen && portalContainerRef.current && createPortal(
    <div
      onClick={closeModal}
      style="pointer-events:auto; position:fixed; inset:0; z-index:2147483647;
       background:rgba(0,0,0,0.45); display:flex; align-items:center;
       justify-content:center;
       backdrop-filter:blur(2px); animation:nlFadeIn 0.15s ease;"
    >
      <style>{`
        @keyframes nlFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes nlSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .nl-modal-card {
          animation: nlSlideUp 0.18s ease;
          width: min(480px, calc(100vw - 32px));
          max-height: 88vh;
          overflow-y: auto;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 8px 40px rgba(0,0,0,0.22);
          scrollbar-width: none;
        }
        .nl-modal-card::-webkit-scrollbar { display: none; }
      `}</style>

      <div class="nl-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Sticky header */}
        {/* <div style="position:sticky;top:0;z-index:10;display:flex;align-items:center;
                    justify-content:space-between;padding:12px 16px 10px;
                    border-bottom:1px solid #f0f0f0;background:#fff;
                    border-radius:16px 16px 0 0;">
          <div style="display:flex;align-items:center;gap:8px;">
            <img src={OFF_LOGO.ICON} alt="NutriLens" style="width:20px;height:20px;" />
            <span style="font-size:13px;font-weight:600;color:#1f2937;">NutriLens</span>
          </div>
          <button
            onClick={closeModal}
            style="background:none;border:none;cursor:pointer;padding:4px 6px;
                   border-radius:6px;color:#9ca3af;font-size:16px;line-height:1;
                   display:flex;align-items:center;justify-content:center;"
          >
            ✕
          </button>
        </div> */}

        <div>{modalContent()}</div>
      </div>
    </div>,
    portalContainerRef.current
  );

  return (
    <>
      <ListBanner
        productData={product ?? data}  // falls back to raw page data while loading
        loading={loading}
        notFound={notFound}
        onClick={handleBannerClick}
      />
      {modal}
    </>
  );
}