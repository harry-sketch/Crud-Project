"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../server/db";
import { posts } from "../server/db/schema";
import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string;
   if (!title || typeof title !== "string" || title.trim() === "") {
    throw new Error("Required");
  }
  await db.insert(posts).values({
    name: title.trim(),
  });
  revalidatePath('/');
}