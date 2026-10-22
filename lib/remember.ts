"use client";

const NAME_KEY = "tg-name";

export function rememberedName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name.trim());
  } catch {
    // Private browsing can block storage; the form still works without it.
  }
}
