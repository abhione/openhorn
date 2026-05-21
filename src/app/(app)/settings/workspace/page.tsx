import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function WorkspaceSettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const workspace = session.user.workspaceId
    ? await prisma.workspace.findUnique({ where: { id: session.user.workspaceId } })
    : null;
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Workspace Settings</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
          <input type="text" defaultValue={workspace?.name || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" defaultValue={workspace?.slug || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 outline-none" disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <input type="text" defaultValue={(workspace as any)?.timezone || "America/New_York"} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" disabled />
        </div>
        <p className="text-sm text-gray-500">Workspace editing will be enabled in a future update.</p>
      </div>
    </div>
  );
}
