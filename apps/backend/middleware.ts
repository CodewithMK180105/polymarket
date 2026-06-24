import { createClient } from "@supabase/supabase-js";
import { prisma } from "db";
import type { NextFunction, Request, Response } from "express";

const supabaseUrl = "https://oljprmqrtevlseoushbu.supabase.co";
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export async function middleware(req: Request, res: Response, next: NextFunction) {
    // Strip 'Bearer ' prefix if present — Supabase getUser needs the raw JWT
    const rawToken = req.headers.authorization ?? "";
    const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

    if (!token) {
        res.status(403).json({ message: "No auth token provided" });
        return;
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("[middleware] Supabase getUser error:", error?.message ?? "No user returned");
            res.status(403).json({ message: "Invalid or expired token" });
            return;
        }

        // Try both possible claim paths for Web3 auth
        const meta = user.user_metadata as Record<string, any>;
        const address: string =
            meta?.custom_claims?.address ||
            meta?.address ||
            "";

        if (!address) {
            console.error("[middleware] No wallet address in user_metadata:", JSON.stringify(meta));
            res.status(403).json({ message: "Wallet address not found in token" });
            return;
        }

        const userDb = await prisma.user.upsert({
            where: { address },
            update: { address },
            create: { address, usdBalance: 0 },
        });

        req.userId = userDb.id;
        next();
    } catch (e: any) {
        console.error("[middleware] Unexpected error:", e?.message);
        res.status(403).json({ message: "Authentication failed" });
    }
}