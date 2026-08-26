import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "DocTracer Pro Business",
              description: "Abonnement mensuel : Documents illimités & tracking avancé",
            },
            unit_amount: 1500, // 15,00 €
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?payment=success`,
      cancel_url: `${appUrl}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erreur Stripe Checkout:", error);
    return NextResponse.json({ error: error.message || "Erreur de paiement" }, { status: 500 });
  }
}
