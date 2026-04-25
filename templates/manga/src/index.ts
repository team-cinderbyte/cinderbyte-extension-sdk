import { api } from "../../../runtime/api";

export async function search(query: string) {
  const json = await api.json(`https://api.example.com?q=${query}`);

  return json.results.map((m: any) => ({
    id: m.id,
    title: m.title,
  }));
}
