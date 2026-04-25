import { api } from "../runtime/api.js";

export async function search(query) {
  const json = await api.json(`https://api.example.com/search?q=${query}`);

  return json.results.map((m) => ({
    id: m.id,
    title: m.title,
    cover: m.cover,
  }));
}

export async function getChapters(id) {
  const json = await api.json(`https://api.example.com/chapters/${id}`);

  return json.map((c) => ({
    id: c.id,
    title: c.title,
    number: c.number,
  }));
}
