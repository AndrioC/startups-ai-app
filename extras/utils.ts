import { Buffer } from "buffer";

interface Colors {
  [key: string]: string;
}
export interface BusinessModelColors {
  [key: string]:
    | "green"
    | "blue"
    | "ruby"
    | "purple"
    | "crimson"
    | "pink"
    | "red";
}
export function getBadgeColorByBusinessModel(businessModel: string): string {
  const colors: Colors = {
    b2b: "green",
    b2c: "blue",
    b2e: "ruby",
    b2g: "purple",
    b2b2c: "crimson",
    b2i: "pink",
    "b2b-b2c": "red",
  };

  return colors[businessModel];
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
