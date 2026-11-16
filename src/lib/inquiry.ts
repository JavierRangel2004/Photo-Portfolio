/** Netlify's static form endpoint. Injectable transport allows testing without sending mail. */
export async function sendInquiry(
  data: FormData,
  transport: typeof fetch = fetch,
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const body = new URLSearchParams();
  data.forEach((value, key) => body.set(key, String(value)));
  try {
    const response = await transport("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Inquiry rejected (${response.status})`);
  } finally {
    clearTimeout(timer);
  }
}
