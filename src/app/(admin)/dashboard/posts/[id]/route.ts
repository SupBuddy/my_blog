"use server";

import {
  togglePostPublishStatus,
  deletePost,
  getAdminPostById,
} from "@/actions/admin-post";
import { redirect } from "next/navigation";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(request: Request, context: RouteContext) {
  const postId = parseInt(context.params.id, 10);

  // 检查是否是删除请求（通过表单隐藏字段）
  const formData = await request.formData();
  const methodOverride = formData.get("_method");

  if (postId) {
    if (methodOverride === "DELETE") {
      // 执行删除
      await deletePost(postId);
    } else {
      // 执行状态切换
      const { success, data } = await getAdminPostById(postId);

      if (success && data) {
        // 切换状态：如果当前已发布，则取消发布；如果当前是草稿，则发布
        const newStatus = !data.published;
        await togglePostPublishStatus(postId, newStatus);
      }
    }
  }

  redirect("/dashboard/posts");
}

export async function DELETE(request: Request, context: RouteContext) {
  const postId = parseInt(context.params.id, 10);

  if (postId) {
    await deletePost(postId);
  }

  redirect("/dashboard/posts");
}
