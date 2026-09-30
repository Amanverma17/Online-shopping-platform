const API_URL = "http://localhost:8080/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Backend returned:", text);

    throw new Error(
      "Server returned an invalid response"
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Something went wrong"
    );
  }

  return data;
}