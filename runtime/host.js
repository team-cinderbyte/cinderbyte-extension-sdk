const http = require("http");
const fs = require("fs");
const path = require("path");

// 1. Injected SDK context
globalThis.Cbe = {
  mapResults: (items) => ({
    results: (items || []).map((x) => ({
      id: x.id || x.slug,
      title: x.title || "Unknown",
      cover: x.cover || x.image || "",
      status: x.status || "Unknown",
    })),
  }),
};

// 2. Load the developer's code
try {
  const entryPath = path.join(__dirname, "main.js");
  const code = fs.readFileSync(entryPath, "utf8");

  // Evaluate and extract functions
  const ext = eval(code + "; ({ search, getDetails })");

  // 3. Start the Sidecar Server
  const [, , portArg] = process.argv;
  const port = portArg || 3333;

  http
    .createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${port}`);
      res.setHeader("Content-Type", "application/json");

      try {
        if (url.pathname === "/search") {
          const query = url.searchParams.get("q");
          const data = await ext.search(query);
          res.end(JSON.stringify(data));
        } else if (url.pathname === "/details") {
          const id = url.searchParams.get("id");
          const data = await ext.getDetails(id);
          res.end(JSON.stringify(data));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Endpoint not found" }));
        }
      } catch (innerError) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: innerError.message }));
      }
    })
    .listen(port, () => {
      console.log(`Cinderbyte Sidecar active on port ${port}`);
    });
} catch (err) {
  console.error("Failed to boot extension host:", err);
  process.exit(1);
}
