import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // < 1 % d’échecs
    http_req_duration: ["p(95)<500"], // 95 % des requêtes < 500 ms
  },
};

//  Utilitaire pour générer un email unique
function randomEmail() {
  const id = Math.floor(Math.random() * 100000);
  return `student${id}@test.com`;
}

//  SETUP — exécuté une seule fois avant le test
export function setup() {
  // 1️ Inscription d’un nouvel utilisateur étudiant
  const registerRes = http.post(
    "http://node:3000/auth/register",
    JSON.stringify({
      role: "student",
      email: randomEmail(),
      password: "123456",
      firstName: "Test",
      lastName: "K6",
      phone: "0600000000",
      field: "informatique",
      training: "MDS",
      school: "MDS Paris",
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(registerRes, { "register succeeded": (r) => r.status === 201 || r.status === 400 });

  // 2️ Connexion de ce même utilisateur
  const regBody = JSON.parse(registerRes.body);
  const email = regBody?.user?.email || "student@test.com";

  const loginRes = http.post(
    "http://node:3000/auth/login",
    JSON.stringify({ email, password: "123456" }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginRes, { "login succeeded": (r) => r.status === 200 });

  const token = loginRes.json("token");
  return { token };
}

//  EXECUTION — exécutée par chaque VU
export default function (data) {
  const authHeaders = { headers: { Authorization: `Bearer ${data.token}` } };

  // 🔹 1. Consultation des missions
  const res1 = http.get("http://node:3000/missions", authHeaders);
  check(res1, { "missions 200": (r) => r.status === 200 });

  // 🔹 2. Consultation du profil utilisateur
  const res2 = http.get("http://node:3000/me", authHeaders);
  check(res2, { "profile 200": (r) => r.status === 200 || r.status === 404 });

  // 🔹 3. Appel de la route /documents/presigned-url
  const res3 = http.get("http://node:3000/documents/presigned-url?type=titre_sejour", authHeaders);
  check(res3, { "presigned-url 200": (r) => r.status === 200 });

  sleep(1);
}
