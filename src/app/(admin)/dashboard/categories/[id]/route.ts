"use server";

import { deleteCategory } from "@/actions/admin-category";
import { redirect } from "next/navigation";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(request: Request, context: RouteContext) {
  const categoryId = parseInt(context.params.id, 10);

  if (categoryId) {
    await deleteCategory(categoryId);
  }

  redirect("/dashboard/categories");
}
