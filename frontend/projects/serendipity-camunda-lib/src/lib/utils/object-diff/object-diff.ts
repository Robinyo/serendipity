export interface DiffDetail {
  oldValue: any;
  newValue: any;
}

export type ObjectDiff = {
  [key: string]: DiffDetail | ObjectDiff;
};

export function getDeepDiff(obj1: Record<string, any>, obj2: Record<string, any>): ObjectDiff {
  const diff: ObjectDiff = {};

  const isObject = (val: any): val is Record<string, any> =>
    val !== null && typeof val === 'object' && !Array.isArray(val);

  const allKeys = new Set([
    ...Object.keys(obj1 || {}),
    ...Object.keys(obj2 || {})
  ]);

  for (const key of allKeys) {
    const val1 = obj1?.[key];
    const val2 = obj2?.[key];

    if (isObject(val1) && isObject(val2)) {
      const nestedDiff = getDeepDiff(val1, val2);
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }
    } else if (val1 !== val2) {
      diff[key] = {
        oldValue: val1 ?? null,
        newValue: val2 ?? null
      };
    }
  }

  return diff;
}
