import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// MTN Mobile Money API Integration
export async function initiateMTNPayment(
  phoneNumber: string,
  amount: number,
  currency: string = "UGX"
) {
  try {
    // Initialize payment with MTN API
    const config = {
      headers: {
        "X-Reference-Id": `TXN_${Date.now()}`,
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      amount: amount.toString(),
      currency: currency,
      externalId: `EXT_${Date.now()}`,
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: "Payment for AI Studio Credits",
      payeeNote: "AI Studio Credit Purchase",
    };

    const response = await axios.post(
      `${process.env.MTN_API_URL}/v1_0/requesttopay`,
      payload,
      config
    );

    return {
      status: "pending",
      transactionId: config.headers["X-Reference-Id"],
      reference: response.headers["x-reference-id"],
    };
  } catch (error) {
    console.error("MTN Payment Error:", error);
    throw error;
  }
}

// Check MTN Payment Status
export async function checkMTNPaymentStatus(
  transactionId: string
) {
  try {
    const config = {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
      },
    };

    const response = await axios.get(
      `${process.env.MTN_API_URL}/v1_0/requesttopay/${transactionId}`,
      config
    );

    return {
      status: response.data.status, // SUCCESSFUL, PENDING, FAILED
      amount: response.data.amount,
      currency: response.data.currency,
    };
  } catch (error) {
    console.error("MTN Status Check Error:", error);
    throw error;
  }
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    const { action, phoneNumber, amount, currency, transactionId } =
      await request.json();

    if (action === "initiate") {
      const result = await initiateMTNPayment(phoneNumber, amount, currency);
      return NextResponse.json(result, { status: 200 });
    }

    if (action === "checkStatus") {
      const result = await checkMTNPaymentStatus(transactionId);
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("MTN API Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 }
    );
  }
}
