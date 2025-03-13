import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ error: "Transaction reference is required" }, { status: 400 });
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paystackResponse = await response.json();

    if (!paystackResponse.status || paystackResponse.data.status !== "success") {
      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed" 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      data: paystackResponse.data 
    });
  } catch (error) {
    console.error("Verification error:", (error as Error).message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}