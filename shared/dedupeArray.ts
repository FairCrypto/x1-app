export const dedupeArray = (arr: Array<any>, field: string) =>
  arr.filter(
    (v: any, i: number, a: Array<any>) => a.findIndex((v2: any) => v2[field] === v[field]) === i
  );

export const dedupePrimitiveArray = (arr: Array<any>) =>
  arr.filter((v: any, i: number, a: Array<any>) => a.findIndex((v2: any) => v2 === v) === i);
