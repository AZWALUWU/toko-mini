interface Env {
  DB?: any;
  ADMIN_PIN?: string;
}

const DEFAULT_PIN = "123456";

export const onRequestPut = async (context: {
  request: Request;
  params: { id: string };
  env: Env;
}) => {
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

    const { id } = context.params;
    const data = await context.request.json() as any;
    const { name, category, price, unit, stock, description, image } = data;

    await context.env.DB.prepare(
      "UPDATE products SET name = ?, category = ?, price = ?, unit = ?, stock = ?, description = ?, image = ? WHERE id = ?"
    )
      .bind(
        name.trim(),
        category,
        Number(price),
        unit.trim(),
        Number(stock),
        (description || "").trim(),
        (image || "").trim(),
        id
      )
      .run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to update product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestDelete = async (context: {
  request: Request;
  params: { id: string };
  env: Env;
}) => {
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

    const { id } = context.params;
    await context.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to delete product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
