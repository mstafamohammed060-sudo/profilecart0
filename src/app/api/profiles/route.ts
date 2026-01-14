// src/app/api/profiles/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supebase";

export async function GET() {
  const { data, error } = await supabase.from("Profile").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, social_media, phone_numbers } = body;

    const { data, error } = await supabase.from("Profile").insert({
      username,
      social_media,
      phone_numbers,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
