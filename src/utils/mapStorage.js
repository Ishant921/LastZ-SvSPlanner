export function saveMap(name, colors, labels, legend) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("saved-maps")) || {};

    saved[name] = {
      colors,
      labels,
      legend,
    };

    localStorage.setItem(
      "saved-maps",
      JSON.stringify(saved)
    );
  } catch (err) {
    console.error("Failed to save map:", err);
  }
}

export function loadMap(name) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("saved-maps")) || {};

    return saved[name] || null;
  } catch (err) {
    console.error("Failed to load map:", err);
    return null;
  }
}

export function getSavedMaps() {
  try {
    const saved =
      JSON.parse(localStorage.getItem("saved-maps")) || {};

    return Object.keys(saved);
  } catch (err) {
    console.error("Failed to get saved maps:", err);
    return [];
  }
}

export function deleteMap(name) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("saved-maps")) || {};

    delete saved[name];

    localStorage.setItem(
      "saved-maps",
      JSON.stringify(saved)
    );
  } catch (err) {
    console.error("Failed to delete map:", err);
  }
}
export function mapExists(name) {
  try {
    const saved =
      JSON.parse(localStorage.getItem("saved-maps")) || {};

    return name in saved;
  } catch {
    return false;
  }
}