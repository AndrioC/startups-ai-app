import axios from "axios";

interface M2MToken {
  token: string;
}

const BASE_API_URL = process.env.API_COGTECH_BASE_URL as string;
const CLIENT_ID = process.env.API_COGTECH_CLIENT_ID as string;
const CLIENT_SECRET = process.env.API_COGTECH_CLIENT_SECRET as string;

export async function generateM2MToken(): Promise<{
  token: M2MToken | null;
  error: string | null;
}> {
  const url = `${BASE_API_URL}/m2m/token`;
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  try {
    const response = await axios.get<M2MToken>(url, { params });
    return { token: response.data, error: null };
  } catch (error) {
    console.error("Error generating M2M token:", error);
    return {
      token: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
