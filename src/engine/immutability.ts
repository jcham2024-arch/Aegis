/**
 * Immutability Engine for Zero-Trust Boundary Protection
 * Enforces deep freezing of all payload objects crossing the host-to-WebView boundary.
 */

export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = (obj as Record<string, unknown>)[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

export function isDeepFrozen(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object') {
    return true;
  }
  if (!Object.isFrozen(obj)) {
    return false;
  }
  return Object.getOwnPropertyNames(obj).every((key) =>
    isDeepFrozen((obj as Record<string, unknown>)[key])
  );
}

export function cloneAndFreeze<T>(obj: T): Readonly<T> {
  const cloned = JSON.parse(JSON.stringify(obj));
  return deepFreeze(cloned);
}
