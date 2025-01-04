import { getAccountDetails, getAurinkoAccessToken } from "@/lib/aurinko";
import { type AccountDetails, type AurinkoAccessToken } from "@/lib/types";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { error: "Account connection failed" },
      { status: 400 },
    );

  const code = params.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Failed to fetch code" },
      { status: 400 },
    );
  }

  // Exchanging the code with aurinko and getting the access token
  const token = await getAurinkoAccessToken(code as string);

  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );
  const accountDetails = await getAccountDetails(token.accessToken);

  // try {
  //   await createOrUpdateAccount({
  //     userId,
  //     token,
  //     accountDetails,
  //   });
  //   console.log("Account created or updated successfully");
  // } catch (error) {
  //   console.error("Failed to process account:", error);
  // }
  await db.account.upsert({
    where: { id: token.accountId.toString() },
    create: {
      id: token.accountId.toString(),
      userId,
      token: token.accessToken,
      provider: "Aurinko",
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
    update: {
      token: token.accessToken,
    },
  });
  // this callback is going to hit our endpoint /api/initial-sync where we would try to fetch the emails from the user
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      }),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};

async function createOrUpdateAccount({
  userId,
  token,
  accountDetails,
}: {
  userId: string;
  token: AurinkoAccessToken;
  accountDetails: AccountDetails;
}) {
  try {
    await db.$transaction(async (tx) => {
      const existingAccount = await tx.account.findFirst({
        where: { userId: userId },
      });

      if (!existingAccount) {
        await tx.account.create({
          data: {
            id: token.accountId.toString(), // Aurinko Account ID
            userId,
            token: token.accessToken,
            provider: "Aurinko",
            emailAddress: accountDetails.email,
            name: accountDetails.name,
          },
        });
      } else {
        await tx.account.update({
          where: { id: existingAccount.id }, // Use the unique ID field (aurinko)
          data: {
            token: token.accessToken,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error creating or updating account:", error);
    throw new Error("Failed to create or update account");
  }
}
