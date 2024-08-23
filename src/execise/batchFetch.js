function batchFetch(urls, maxCount) {
  const result = [];
  let finishedCount = 0;
  let currentIndex = maxCount - 1;
  function handleFetch(url, index, resolve) {
    const handleResponse = (res) => {
      finishedCount++;
      result[index] = res;
      if (finishedCount >= urls.length) {
        resolve(result);
      } else {
        currentIndex++;
        handleFetch(urls[currentIndex], currentIndex);
      }
    };
    fetch(url).then(handleResponse, handleResponse);
  }
  return new Promise((resolve) => {
    urls.slice(0, maxCount).forEach((url, index) => {
      handleFetch(url, index, resolve);
    });
  });
}
