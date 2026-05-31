"use server"

import { fetchApi } from "../helpers/api"
import { cookies } from "next/headers"

export async function syncCartAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const response = await fetchApi("/cart", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error("Cart sync error:", error);
    return null;
  }
}

export async function mergeCartAction(guestItems: { productId: string, quantity: number }[]) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const response = await fetchApi("/cart/merge", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ guestItems }),
    });
    return await response.json();
  } catch (error) {
    console.error("Cart merge error:", error);
    return null;
  }
}

export async function addCartItemAction(productId: string, quantity: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null; // Guest cart, do nothing on the server

    const response = await fetchApi("/cart/items", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity }),
    });
    return await response.json();
  } catch (error) {
    console.error("Add cart item error:", error);
    return null;
  }
}

export async function updateCartItemQuantityAction(productId: string, quantity: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const response = await fetchApi(`/cart/items/${productId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quantity }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update cart item error:", error);
    return null;
  }
}

export async function removeCartItemAction(productId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const response = await fetchApi(`/cart/items/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Remove cart item error:", error);
    return null;
  }
}

export async function clearCartAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const response = await fetchApi(`/cart`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Clear cart error:", error);
    return null;
  }
}
