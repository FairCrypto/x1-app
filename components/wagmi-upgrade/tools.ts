export function paginatedIndexesConfig(
  fn: (index: number) => any[], {
    perPage,
    start,
    direction,
  }: { perPage: number; start: number; direction: 'increment' | 'decrement' }) {
  const contracts = ((page = 0) =>
    [...Array(perPage).keys()]
      .map((index) => {
        return direction === 'increment'
          ? start + index + page * perPage
          : start - index - page * perPage
      })
      .filter((index) => index >= 0)
      .flatMap(fn)) as unknown as typeof fn

  return {
    contracts,
    getNextPageParam(lastPage: unknown[], pages: unknown[]) {
      return lastPage?.length === perPage ? pages.length : undefined
    },
  }
}