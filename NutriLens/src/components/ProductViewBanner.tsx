import { useEffect, useState } from "preact/hooks";
import { Loader } from "./ProductView/Loader";
import { NotFound } from "./ProductView/NotFound";
import { Banner } from "./ProductView/Banner";

export const ProductViewBanner = ({ data }: { data: any }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const minLoadTime = 1000; // manual delay for showing loader

    setLoading(true);
    setNotFound(false);

    const fetchPromise = browser.runtime.sendMessage({
      type: 'FETCH_PRODUCT_DATA',
      data: data,
    });

    const minTimePromise = new Promise(resolve => setTimeout(resolve, minLoadTime));

    Promise.all([fetchPromise, minTimePromise])
      .then(([res]) => {
        if (cancelled) return;
        if (!res) {
          setNotFound(true);
          return;
        }
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

    return () => {
      cancelled = true;
    };
  }, [data]);

  if (loading) return <Loader />;
  if (notFound) return <NotFound />;
  if (!product) return null;

  return <Banner data={product} />
};
