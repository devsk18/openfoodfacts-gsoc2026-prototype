import { useState, useRef, useCallback } from "preact/hooks";
import { ListBanner } from "./ListBanner";
import { Banner } from "./Banner";
import { Loader } from "../ProductView/Loader";
import { NotFound } from "../ProductView/NotFound";

interface Props {
  data: any; // intercepted page data passed from orchestrator
}

export function HoverBannerWrapper({ data }: Props) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProduct = useCallback(async () => {
    if (product || loading) return; // already fetched or in flight
    setLoading(true);
    setNotFound(false);
    try {
      const [res] = await Promise.all([
        browser.runtime.sendMessage({ type: 'FETCH_PRODUCT_DATA', data }),
        new Promise(r => setTimeout(r, 600)),
      ]);
      if (!res) { setNotFound(true); return; }
      setProduct(res);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [data, product, loading]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHovered(true);
    setModalOpen(true);
    fetchProduct();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    // small delay so user can move cursor into the modal without it closing
    closeTimer.current = setTimeout(() => setModalOpen(false), 300);
  };

  const handleModalEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleModalLeave = () => {
    closeTimer.current = setTimeout(() => {
      setModalOpen(false);
      setHovered(false);
    }, 200);
  };

  const modalContent = () => {
    if (loading) return <Loader />;
    if (notFound) return <NotFound />;
    if (!product) return null;
    return <Banner data={product} />;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>

      {/* ── Compact list banner ── */}
      <ListBanner
        productData={data}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        // hovered={hovered}
      />

      {/* ── Hover modal ── */}
      {modalOpen && (
        <div
          onMouseEnter={handleModalEnter}
          onMouseLeave={handleModalLeave}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 2147483647,
            width: 'min(480px, calc(100vw - 48px))',
            maxHeight: '85vh',
            overflowY: 'auto',
            borderRadius: '16px',
            background: '#fff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
            animation: 'nlFadeUp 0.18s ease',
          }}
        >
          {/* Inline keyframes — safe inside shadow DOM */}
          <style>{`
            @keyframes nlFadeUp {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {modalContent()}
        </div>
      )}
    </div>
  );
}