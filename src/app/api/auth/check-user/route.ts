import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const email = request.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists in our database
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (!user) {
      return NextResponse.json({
        success: true,
        hasData: false,
        isNewUser: true,
        message: "User not found in database - new user",
      })
    }

    // User exists - check if they have any briefs or proposals
    const { count: briefsCount } = await supabase
      .from("briefs")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id)

    const { count: proposalsCount } = await supabase
      .from("proposals")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id)

    const hasData = (briefsCount || 0) > 0 || (proposalsCount || 0) > 0

    return NextResponse.json({
      success: true,
      hasData,
      isNewUser: !hasData,
      userId: user.id,
      stats: {
        briefs: briefsCount || 0,
        proposals: proposalsCount || 0,
      },
    })
  } catch (error) {
    console.error("Check user error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check user" },
      { status: 500 }
    )
  }
}
