import { Buffer } from "buffer";

interface Colors {
  [key: string]: string;
}

export function getBadgeColorByBusinessModel(businessModel: string): string {
  const variants: Record<string, string> = {
    b2b: "b2b",
    b2c: "b2c",
    b2e: "b2e",
    b2g: "b2g",
    b2b2c: "b2b2c",
    b2i: "b2i",
    "b2b-b2c": "b2b-b2c",
  };

  return variants[businessModel] || "default";
}

export function getBadgeColorByApprovalStatus(status: string): string {
  const colors: Colors = {
    approved: "blue",
    pending: "red",
  };

  return colors[status];
}

export function createSlug(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  return slug;
}

export async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error fetching or converting file:", error);
    throw error;
  }
}
