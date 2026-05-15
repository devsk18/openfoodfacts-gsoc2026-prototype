import { useEffect, useState } from "preact/hooks";
import { Loader } from "./ProductView/Loader";
import { NotFound } from "./ProductView/NotFound";
import { Banner } from "./ProductView/Banner";
import { OFF_LOGO } from "./UI/OffLogo";

export const ProductViewBanner = ({ data }: { data: any }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setNotFound(false);

    const fetchPromise = browser.runtime.sendMessage({
      type: "FETCH_PRODUCT_DATA",
      data: data,
    });

    const minTimePromise = new Promise((resolve) => setTimeout(resolve, 1000));

    Promise.all([fetchPromise, minTimePromise])
      .then(([res]) => {
        if (cancelled) return;
        if (!res) { setNotFound(true); return; }
        setProduct(res);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [data]);

  const modalContent = () => {
    if (loading) return <Loader />;
    if (notFound) return <NotFound />;
    if (!product) return null;
    return <Banner data={product} />;
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onMouseEnter={() => setModalOpen(true)}
        // onMouseLeave={() => setModalOpen(false)}
        onClick={() => setModalOpen(true)}
        aria-label="Open product info"
        class="fixed bottom-6 right-6 z-2147483646 size-[52px] rounded-full border-none 
               shadow-[0_4px_16px_rgba(0,0,0,0.18),0_1px_4px_rgba(0,0,0,0.10)]
               flex items-center justify-center cursor-pointer
               transition-transform duration-150 ease-in-out
               hover:scale-110 hover:shadow-[0_6px_20px_rgba(0,0,0,0.22),0_2px_6px_rgba(0,0,0,0.12)]"
      >
        <img src={OFF_LOGO.ICON} alt="Open Food Facts" class="size-12" />
      </button>

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          class="fixed inset-0 z-9999 flex items-end justify-center pb-22
                 bg-black/45 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="relative w-[min(480px,calc(100vw-32px))] max-h-100 overflow-y-auto
                   rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.22)] no-scrollbar"
          >
            {/* Modal Header */}
            {/* <div class="sticky top-0 z-10 flex items-center justify-between
                        border-b border-gray-100 bg-white px-4 pb-[10px] pt-[14px] rounded-t-2xl">
              <div class="flex items-center gap-2">
                <img src={OFF_LOGO.ICON} alt="Open Food Facts" class="size-6" />
                <span class="text-[13px] font-semibold text-gray-800">
                  NutriLens
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                class="flex size-7 items-center justify-center rounded-md border-none
                       bg-transparent text-lg leading-none text-gray-400
                       cursor-pointer hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div> */}

            {/* Modal Body */}
            <div class="p-4">
              {modalContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};