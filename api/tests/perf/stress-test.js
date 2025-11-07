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

function randomEmail() {
  const id = Math.floor(Math.random() * 100000);
  return `student${id}@test.com`;
}

export function setup() {
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

export default function (data) {
  const authHeaders = { headers: { Authorization: `Bearer ${data.token}` } };

  const res1 = http.get("http://node:3000/missions", authHeaders);
  check(res1, { "missions 200": (r) => r.status === 200 });

  const res2 = http.get("http://node:3000/me", authHeaders);
  check(res2, { "profile 200": (r) => r.status === 200 || r.status === 404 });

  const res3 = http.get("http://node:3000/documents/presigned-url?type=titre_sejour", authHeaders);
  check(res3, { "presigned-url 200": (r) => r.status === 200 });

  sleep(1);
}
