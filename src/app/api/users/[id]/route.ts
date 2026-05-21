import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/users/:id — update role or deactivate (admin only)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { role, status } = await req.json();
  const updateData: Record<string, string> = {};
  if (role) updateData.role = role;
  if (status) updateData.status = status;

  const user = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return NextResponse.json(user);
}
