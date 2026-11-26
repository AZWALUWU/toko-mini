interface Env {
  DB?: any;
  ADMIN_PIN?: string;
}

const DEFAULT_PIN = "123456";

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database binding DB not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { results } = await context.env.DB.prepare(
      "SELECT id, name, category, price, unit, stock, description, image FROM products ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const pin = context.request.headers.get("x-admin-pin");
    const expectedPin = context.env.ADMIN_PIN || DEFAULT_PIN;

    if (pin !== expectedPin) {
      return new Response(JSON.stringify({ error: "PIN Admin tidak valid" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database binding DB not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await context.request.json() as any;
    const { id, name, category, price, unit, stock, description, image } = data;

    if (!id || !name || !category || price == null || !unit || stock == null) {
      return new Response(JSON.stringify({ error: "Data produk tidak lengkap" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await context.env.DB.prepare(
      "INSERT INTO products (id, name, category, price, unit, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        id,
        name.trim(),
        category,
        Number(price),
        unit.trim(),
        Number(stock),
        (description || "").trim(),
        (image || "").trim()
      )
      .run();

    return new Response(JSON.stringify({ success: true, product: data }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
