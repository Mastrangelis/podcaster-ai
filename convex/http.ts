// ===== reference links =====
// https://www.convex.dev/templates (open the link and choose for clerk than you will get the github link mentioned below)
// https://github.dev/webdevcody/thumbnail-critique/blob/6637671d72513cfe13d00cb7a2990b23801eb327/convex/schema.ts

import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

function generateGuestName(): string {
  const prefix = "Guest";
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit number

  return `${prefix}${randomNumber}`;
}

function isLessThanFiveMinutesAgo(timestamp: number): boolean {
  const currentTime = Date.now(); // Current time in milliseconds since epoch
  const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds

  return currentTime - timestamp < fiveMinutesInMilliseconds;
}

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);

  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }

  if (event.type === "user.created") {
    await ctx.runMutation(internal.users.createUser, {
      clerkId: event.data.id,
      email: event.data.email_addresses[0].email_address,
      imageUrl: event.data.image_url,
      name:
        event.data.first_name || event.data.last_name
          ? `${event.data.first_name} ${event.data.last_name}`
          : generateGuestName(),
    });
  }

  if (event.type === "user.updated") {
    await ctx.runMutation(internal.users.updateUser, {
      clerkId: event.data.id,
      imageUrl: event.data.image_url,
      email: event.data.email_addresses[0].email_address,
      name: `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`,
    });
  }

  if (event.type === "user.deleted") {
    await ctx.runMutation(internal.users.deleteUserInternal, {
      clerkId: event.data.id as string,
    });
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

const validateRequest = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.NEXT_CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payloadString, svixHeaders);
  return event as unknown as WebhookEvent;
};

export default http;
