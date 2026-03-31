import { useEffect, useState } from "preact/hooks";
import { Loader } from "./ListView/Loader";
import { NotFound } from "./ListView/NotFound";
import { Banner } from "./ListView/Banner";


export const ListViewBanner = ({ data }: { data: any }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setNotFound(false);
    console.log(data);
    browser.runtime.sendMessage({
      type: 'FETCH_PRODUCT_DATA',
      data: data,
    })
      .then((res) => {
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

  return <Banner productData={product} />
};
