import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,              // 5 utilisateurs simultanés
  duration: "30s",     // pendant 30 secondes
  thresholds: {
    http_req_failed: ["rate<0.01"], // moins de 1 % d’erreurs
    http_req_duration: ["p(95)<300"], // 95 % des requêtes < 300 ms
  },
};

export default function () {
  const res = http.get("http://node:3000/");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
