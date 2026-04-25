export function transformManifest(m) {
  return {
    id: m.id,
    name: m.name,
    version: m.version,
    type: m.type,
    entry: "main.js",
    path: `${m.id}-${m.version}.ext`,
    author: m.author,
    description: m.description,
    lang: m.lang,
    features: m.features || {},
  };
}
