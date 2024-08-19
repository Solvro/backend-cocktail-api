/**
 * If ids are provided convert to numbers and iterate.
 * If not fallback to start-stop range
 * @param ids array of ids
 * @param start
 * @param stop
 * @returns
 */
function* useIdsIterator(ids: string[], start: number, stop: number) {
  if (!ids || ids.length === 0) {
    for (let i = start; i <= stop; i++) {
      yield i
    }
    return
  }

  for (let i of ids) {
    yield Number(i)
  }
}

export default useIdsIterator
