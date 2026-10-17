(function () {
  const storageKey = "math-lab-catalog-preferences-v1";

  function normalize(preferences = {}) {
    const ids = MathLabData.catalog.map((lesson) => lesson.id);
    const validIds = new Set(ids);
    const savedOrder = Array.isArray(preferences.order) ? preferences.order : [];
    const order = [...new Set(savedOrder.filter((id) => validIds.has(id)))];
    ids.forEach((id) => {
      if (!order.includes(id)) order.push(id);
    });
    const hiddenIds = Array.isArray(preferences.hiddenIds)
      ? [...new Set(preferences.hiddenIds.filter((id) => validIds.has(id)))]
      : [];
    return { order, hiddenIds };
  }

  function load() {
    try {
      const stored = localStorage.getItem(storageKey);
      return normalize(stored ? JSON.parse(stored) : {});
    } catch (error) {
      return normalize();
    }
  }

  function save(preferences) {
    const normalized = normalize(preferences);
    try {
      localStorage.setItem(storageKey, JSON.stringify(normalized));
      return true;
    } catch (error) {
      return false;
    }
  }

  window.MathLabCatalogPreferences = { load, save, normalize };
})();
