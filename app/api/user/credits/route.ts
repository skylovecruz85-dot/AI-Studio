import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mock database for credits
const userCredits: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const userData = userCredits[email] || {
      credits: 30, // New users get 30 free credits
      totalSpent: 0,
      lastDailyClaimDate: null,
      isNewUser: true,
      createdAt: new Date(),
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Get credits error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch credits" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action, amount } = await request.json();
    const email = session.user.email;

    if (!userCredits[email]) {
      userCredits[email] = {
        credits: 30,
        totalSpent: 0,
        lastDailyClaimDate: null,
        isNewUser: true,
        createdAt: new Date(),
      };
    }

    const user = userCredits[email];

    switch (action) {
      case "deduct":
        if (user.credits < amount) {
          return NextResponse.json(
            { message: "Insufficient credits" },
            { status: 400 }
          );
        }
        user.credits -= amount;
        return NextResponse.json({ credits: user.credits }, { status: 200 });

      case "add":
        user.credits += amount;
        return NextResponse.json({ credits: user.credits }, { status: 200 });

      case "dailyClaim":
        const today = new Date().toDateString();
        if (user.lastDailyClaimDate === today) {
          return NextResponse.json(
            { message: "Already claimed today" },
            { status: 400 }
          );
        }
        user.credits += 5;
        user.lastDailyClaimDate = today;
        return NextResponse.json({ credits: user.credits }, { status: 200 });

      case "watchAd":
        user.credits += 2;
        return NextResponse.json({ credits: user.credits }, { status: 200 });

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Credits error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 }
    );
  }
}
