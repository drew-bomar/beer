import { setWorkerUrl } from "maplibre-gl";

// Turbopack fails to emit MapLibre's worker chunk (the request 404s and returns
// HTML, killing the worker and with it all tile loading). Serve the worker as a
// plain static file instead — copied from node_modules by the postinstall script.
// Import this module before constructing any MapLibre Map.
setWorkerUrl("/maplibre-gl-worker.mjs");
