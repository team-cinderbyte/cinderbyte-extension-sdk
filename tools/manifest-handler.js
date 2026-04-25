export function transformManifest(devManifest) {
  return {
    id: devManifest.id,
    name: devManifest.name,
    version: devManifest.version,
    type: devManifest.type,

    entry: "main.js",
    path: `${devManifest.id}-${devManifest.version}.ext`,

    author: devManifest.author,
    description: devManifest.description,

    lang: devManifest.lang,

    features: devManifest.features || {},
  };
}
