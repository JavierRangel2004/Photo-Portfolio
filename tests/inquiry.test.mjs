import { test } from "node:test";
import assert from "node:assert/strict";
import { sendInquiry } from "../src/lib/inquiry.ts";
const inquiry = () => {
  const f = new FormData();
  Object.entries({
    "form-name": "contact",
    "bot-field": "",
    name: "Prueba local",
    email: "test@example.invalid",
    type: "portraits",
    message: "Retrato & campaña — México",
  }).forEach(([k, v]) => f.set(k, v));
  return f;
};
test("encodes Spanish and special characters with Netlify form identity", async () => {
  let request;
  await sendInquiry(inquiry(), async (url, options) => {
    request = { url, options };
    return new Response("", { status: 200 });
  });
  assert.equal(request.url, "/");
  assert.equal(request.options.method, "POST");
  assert.equal(
    request.options.headers["Content-Type"],
    "application/x-www-form-urlencoded",
  );
  const body = new URLSearchParams(request.options.body);
  assert.equal(body.get("form-name"), "contact");
  assert.equal(body.get("message"), "Retrato & campaña — México");
  assert.equal(body.get("type"), "portraits");
  assert.equal(body.get("bot-field"), "");
  assert.ok(request.options.signal instanceof AbortSignal);
});
test("rejects server errors rather than reporting a lead", async () => {
  const f = inquiry();
  await assert.rejects(
    sendInquiry(f, async () => new Response("", { status: 500 })),
    /rejected/,
  );
  assert.equal(f.get("name"), "Prueba local");
});
test("network failure leaves original inquiry available for retry", async () => {
  const f = inquiry();
  await assert.rejects(
    sendInquiry(f, async () => {
      throw new TypeError("offline");
    }),
    /offline/,
  );
  assert.equal(f.get("message"), "Retrato & campaña — México");
});
