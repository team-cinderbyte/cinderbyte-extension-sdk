export function validateManifest(m) {
  const errors = [];

  if (!m.id) errors.push("Missing id");
  if (!m.version) errors.push("Missing version");
  if (!m.entry) errors.push("Missing entry");

  if (typeof m.features !== "object") {
    errors.push("features must be object");
  }

  return errors;
}
