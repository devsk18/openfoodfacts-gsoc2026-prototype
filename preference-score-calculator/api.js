async function fetchData(barcode) {

  const cache = localStorage.getItem("productData-" + barcode);
  if (cache) {
    return JSON.parse(cache);
  }

  const response = await fetch(
    `https://world.openfoodfacts.org/api/v3/product/${barcode}?fields=attribute_groups`,
  );
  const data = await response.json();
  const parsed = parseAttributeGroups(data.product.attribute_groups);

  // to avoid 429 during testing
  localStorage.setItem("productData-" + barcode, JSON.stringify(parsed));

  return parsed;
}

function parseAttributeGroups(attributeGroups) {
  const TARGET_GROUPS = new Set([
    "nutritional_quality",
    "processing",
    "environment",
  ]);

  const result = {};
  for (const group of attributeGroups) {
    const groupId = group.id;

    if (!TARGET_GROUPS.has(groupId)) {
      continue;
    }

    const attrs = group.attributes
      .filter((attr) => {
        if (groupId == "processing") return attr.id == "nova";
        if (groupId == "environment") return attr.id == "ecoscore";
        return true;
      })
      .map((attr) => ({
        id: attr.id,
        grade: attr.grade,
      }));

    result[groupId] = attrs;
  }

  return result;
}
