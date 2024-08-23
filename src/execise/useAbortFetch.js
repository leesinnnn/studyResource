export const useAbortFetch = () => {
  const controller = new AbortController();
  return {
    fetchAbort: (url, init) => {
      return fetch(url, {
        signal: controller.signal,
        ...init
      })
    },
    abort: () => controller.abort()
  }
}