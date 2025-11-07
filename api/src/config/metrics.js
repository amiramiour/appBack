const client = require("prom-client");

// Crée un registre global
const register = new client.Registry();

// Métriques de base Node.js
client.collectDefaultMetrics({ register });

// Compteur de requêtes
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Nombre total de requêtes HTTP",
  labelNames: ["method", "route", "status_code"],
});

register.registerMetric(httpRequestCounter);

// Histogramme de durée
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Durée des requêtes HTTP en ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 300, 500, 1000, 2000],
});

register.registerMetric(httpRequestDuration);

module.exports = { register, httpRequestCounter, httpRequestDuration };
