export const customFetch = async (input: RequestInfo, init?: RequestInit) => {
  return fetch(input, init)
    .then(async (resp) => {
      if (resp.ok) {
        return await resp.json();
      } else {
        const error = await resp.text().then((text) => text);
        throw new Error(error);
      }
    })
    .catch((err) => {
      console.log(`FetchError: ${err}`);
    });
};
