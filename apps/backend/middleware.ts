import { createClient } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";

const supabaseUrl = "https://oljprmqrtevlseoushbu.supabase.co";
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export async function middleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization;

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        const address = user?.user_metadata.custom_claims.address;

        if (address) {
            req.userId = address;
            next();
        } else {
            res.status(403).json({
                message: "Incorrect credentials",
            });
        }
    } catch (e) {
        res.status(403).json({
            message: "Incorrect credentials",
        });
    }
}