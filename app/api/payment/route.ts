import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";

interface Item {
  name: string;
  price: number;
  quantity?: number;
}

interface RequestBody {
  email: string;
  items: Item[];
  amount: number;
}

export async function POST(req: Request) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      console.error("❌ PAYSTACK_SECRET_KEY is missing!");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const body: RequestBody = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0 || !body.email) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    console.log("📤 Sending to Paystack:", {
      email: body.email,
      amount: body.amount * 100, // Convert to kobo
      secretKeyPresent: !!PAYSTACK_SECRET_KEY,
    });

    const response = await fetch(PAYSTACK_INITIALIZE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        amount: body.amount * 100, // Convert to kobo
        currency: "NGN",
        callback_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      }),
    });

    const paystackResponse = await response.json();
    console.log("🔄 Paystack Response:", paystackResponse);

    if (!paystackResponse.status) {
      throw new Error(paystackResponse.message || "Failed to initialize payment");
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackResponse.data.authorization_url,
    });
  } catch (error) {
    console.error("❌ Payment API Error:", (error as Error).message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
