import { desc } from "drizzle-orm";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";
import { addTodo, deleteTodo } from "~/app/actions";

export default async function Home() {
  const toDos = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Things to do
      </h1>

      <form
        action={addTodo}
        className="flex gap-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <input
          name="title"
          required
          placeholder="What needs to be done?"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
        />
        <button className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800">
          Add
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-neutral-900">
          Your work for today
        </h2>

        {toDos.length === 0 ? (
          <p className="text-sm text-neutral-500">No work for today </p>
        ) : (
          toDos.map((t) => (
          <div 
          key={t.id}
    className="flex items-center justify-between gap-4 rounded-3xl border border-neutral-200 bg-white p-5">
    <p className="text-sm font-medium text-neutral-900">{t.name}</p>
    <form action={deleteTodo.bind(null, t.id)}>
      <button
        type="submit"
        className="rounded-2xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
        Remove
      </button>
     </form>
    </div>
    ))        
  )}  
  </div>
</div>
);
}
