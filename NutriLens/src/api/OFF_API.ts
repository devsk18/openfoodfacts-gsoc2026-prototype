export class OFF_API {
  private readonly API_USER_AGENT = "NutriLens/1.0";
  private readonly OFF_API_BASE = "https://world.openfoodfacts.org/api/v2";
  private readonly OFF_SEARCH_BASE = "https://search.openfoodfacts.org";
  private readonly OFF_PRODUCT_ENDPOINT = `${this.OFF_API_BASE}/product`;
  private readonly PRODUCT_FIELDS = [
    "code",
    "nutrient_levels",
    "nutriscore_grade",
    "nova_group",
    "ecoscore_grade",
    "product_name",
    "image_front_small_url",
    "brands",
    "product_quantity",
    "product_quantity_unit",
  ];

  async fetchByBarcode(barcode: string, locale: string) {
    try {
      const url = new URL(`${this.OFF_PRODUCT_ENDPOINT}/${barcode}.json`);
      const searchParams = new URLSearchParams({
        lc: locale,
        fields: this.PRODUCT_FIELDS.join(","),
      });
      url.search = searchParams.toString();

      const response = await fetch(url, {
        headers: { "User-Agent": this.API_USER_AGENT },
      });

      if (!response.ok) {
        console.error("Error fetching product by barcode - " + barcode + " : " + response.statusText);
        return null;
      }

      const data = await response.json();

      if (!data?.product) {
        return null;
      }

      return this.parseAPIResponse(data.product);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async fetchBySearch(query: string, locale: string) {
    try {
      const url = new URL(`${this.OFF_SEARCH_BASE}/search`);
      const searchParams = new URLSearchParams({
        q: query,
        page_size: "1",
        fields: this.PRODUCT_FIELDS.join(","),
        lc: locale,
      });
      url.search = searchParams.toString();
      
      const response = await fetch(url, {
        headers: { 
          "User-Agent": this.API_USER_AGENT 
        },
      });
      const data = await response.json();

      if (!data.count) {
        return null;
      }

      const firstResult = data.hits[0];
      return this.parseAPIResponse(firstResult, true);
    } catch (error) {
      console.error("Error searching product - " + query + " : " + error);
      return null;
    }
  }

  private parseAPIResponse(data: any, isSerachApi: boolean = false) {
    // TODO: use attribute_groups in api and parse that for better UI & preference score
    // attribute_groups dont work with OFF search - need to handle that separately
    console.log("data", data);
    return {
      barcode: data.code || "",
      nutriScore: data.nutriscore_grade || "unknown",
      novaGroup: data.nova_group || "unknown",
      ecoScore: data.ecoscore_grade || "unknown",
      nutrients: {
        fat: data.nutrient_levels?.fat || "unknown",
        saturated_fat: data.nutrient_levels?.["saturated-fat"] || "unknown",
        sugars: data.nutrient_levels?.sugars || "unknown",
        salt: data.nutrient_levels?.salt || "unknown",
      },
      showSearchWarning: isSerachApi,
      productName: data.product_name || "",
      brand: data.brands || "",
      image: data.image_front_small_url || "",
      productQuantity: data.product_quantity || "",
      productQuantityUnit: data.product_quantity_unit || "",
    };
  }
}
