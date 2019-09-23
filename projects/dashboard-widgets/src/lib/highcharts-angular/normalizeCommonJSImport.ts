export function normalizeCommonJSImport<T>(
  importPromise: Promise<T>,
): Promise<T> {
  // CommonJS's `module.exports` is wrapped as `default` in ESModule.
  return importPromise.then((m: any) => (m.default || m) as T);
}

// https://medium.com/lacolaco-blog/angular-dynamic-importing-large-libraries-8ec079603d0

// https://github.com/lacolaco/angular-chartjs-dynamic-import

/*

In this case, TypeScript’s import() returns Promise<typeof Chart> as well as import * as Chart from ‘chart.js’.
This is a problem because chart.js is a CommonJS module. Without any helpers, default doesn’t exist in the result of import().
So we have to mark it as any temporary and remark default as the original type. This is a small hack for correct typing.

*/
