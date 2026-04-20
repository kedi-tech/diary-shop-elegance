const API_URL = import.meta.env.VITE_API_URL;

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product?: { id: string; name: string; images?: { url: string }[] };
};

export type Order = {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
};

export const getClientOrders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/api/v1/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Failed to fetch orders (${response.status}): ${errorText || response.statusText}`);
  }
  const data = await response.json().catch(() => []);
  return Array.isArray(data) ? data : (data.orders ?? data.data ?? []);
};

export type CreateOrderItem = {
  productId: string | number;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
};

export type CreateOrderPayload = {
  clientId: string | number;
  items: CreateOrderItem[];
  total: number;
  paymentMethod: string;
  address: string;
};

export const createOrder = async (
  token: string,
  payload: CreateOrderPayload,
) => {
  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Failed to create order (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return response.json().catch(() => null);
};

export const cancelOrder = async (token: string, orderId: string | number) => {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Failed to cancel order (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return response.json().catch(() => null);
};

