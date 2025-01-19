"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "../../../db";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { Order } from "@prisma/client";
import { stripe } from "@/lib/stripe";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("Configuration not found");
  }

  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  let totalPrice = BASE_PRICE;

  if (configuration.material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (configuration.finish === "textured")
    totalPrice += PRODUCT_PRICES.finish.textured;

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });



  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        configurationId: configuration.id,
        userId: user.id,
        amount: totalPrice / 100,
      },
    });
  }


  const product = await stripe.products.create({
    name: "Custom iphone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: totalPrice,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/configure/preview?orderId=${configuration.id}`,

    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["UA", "AD", "US", "DE", "EG", "ID"],
    },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession?.url };
};
