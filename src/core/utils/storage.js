// Unified storage utility - handles both per-tool and global storage

const PREFIX = "lastz";

/**
 * Gets the full storage key with namespace.
 * @param {string} namespace - 'global' or tool ID
 * @param {string} key - The specific key
 * @returns {string} Full storage key
 */
function getKey(namespace, key) {
  return `${PREFIX}:${namespace}:${key}`;
}

/**
 * Saves data to localStorage.
 * @param {string} namespace - 'global' or tool ID
 * @param {string} key - The specific key
 * @param {any} value - Data to save
 */
export function saveData(namespace, key, value) {
  try {
    const fullKey = getKey(namespace, key);
    localStorage.setItem(fullKey, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
}

/**
 * Loads data from localStorage.
 * @param {string} namespace - 'global' or tool ID
 * @param {string} key - The specific key
 * @param {any} defaultValue - Value to return if not found
 * @returns {any} The stored data or defaultValue
 */
export function loadData(namespace, key, defaultValue = null) {
  try {
    const fullKey = getKey(namespace, key);
    const saved = localStorage.getItem(fullKey);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (err) {
    console.error(`Failed to load ${key}:`, err);
    return defaultValue;
  }
}

/**
 * Deletes data from localStorage.
 * @param {string} namespace - 'global' or tool ID
 * @param {string} key - The specific key
 */
export function deleteData(namespace, key) {
  try {
    const fullKey = getKey(namespace, key);
    localStorage.removeItem(fullKey);
  } catch (err) {
    console.error(`Failed to delete ${key}:`, err);
  }
}

/**
 * Gets all keys for a namespace.
 * @param {string} namespace - 'global' or tool ID
 * @returns {string[]} List of keys (without prefix)
 */
export function getKeys(namespace) {
  try {
    const prefix = getKey(namespace, "");
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.replace(prefix, ""));
  } catch (err) {
    console.error(`Failed to get keys for ${namespace}:`, err);
    return [];
  }
}

/**
 * Clears all data for a namespace.
 * @param {string} namespace - 'global' or tool ID
 */
export function clearNamespace(namespace) {
  try {
    const prefix = getKey(namespace, "");
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => localStorage.removeItem(key));
  } catch (err) {
    console.error(`Failed to clear ${namespace}:`, err);
  }
}
