export const api = {
  async fetch(url, options = {}) {
    const res = await fetch(url, options);
    return await res.text();
  },

  async json(url) {
    const res = await fetch(url);
    return await res.json();
  },

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  },
};
