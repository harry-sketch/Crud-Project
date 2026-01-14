"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Post {
  id: number;
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface ToDoListProps {
  toDos: Post[];
}

export default function ToDoList({ toDos }: ToDoListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const { data: posts = toDos } = api.post.getAll.useQuery(undefined, {
    initialData: toDos,
  });

  const utils = api.useUtils();

  const updateToDo = api.post.update.useMutation({
    onSuccess: () => {
      void utils.post.getAll.invalidate();
      setEditingId(null);
      setEditName("");
    },
  });

  const removeToDo = api.post.delete.useMutation({
    onSuccess: () => {
      void utils.post.getAll.invalidate();
    },
  });

  const startEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = (id: number) => {
    if (editName.trim()) {
      updateToDo.mutate({ id, name: editName });
    }
  };

  const handleRemove = (id: number) => {
    removeToDo.mutate({ id });
  };

  return (
    <div>
      {!posts || posts.length === 0 ? (
               <p className="font-light text-gray-600 tracking-wide">No work for today!</p>
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-orange-600/5"></div>
          
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="border-gray-800 border-b bg-gray-950/50">
                <tr>
                  <th className="px-6 py-4 text-left font-light text-gray-600 text-xs uppercase tracking-widest">
                    To Do
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-900">
                {posts.map((post) => (
                  <tr 
                    key={post.id} 
                    className="group transition-colors duration-200 hover:bg-red-950/5"
                  >
                    <td className="px-6 py-5">
                      {editingId === post.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border-gray-700 border-b bg-transparent px-0 py-1 text-sm text-white focus:border-red-600 focus:outline-none"
                          maxLength={256}
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-light text-sm text-white">{post.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === post.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(post.id)}
                              disabled={!editName.trim() || updateToDo.isPending}
                              className="rounded border border-green-600/30 bg-green-600/10 px-4 py-1.5 text-green-500 text-xs uppercase tracking-wider transition-colors hover:bg-green-600/20 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded border border-gray-700 bg-gray-800/50 px-4 py-1.5 text-gray-400 text-xs uppercase tracking-wider transition-colors hover:bg-gray-800"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(post.id, post.name ?? "")}
                              className="p-2 text-gray-600 transition-colors hover:text-white"
                              title="Edit todos"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(post.id)}
                              disabled={removeToDo.isPending}
                              className="p-2 text-gray-600 transition-colors hover:text-red-600 disabled:opacity-50"
                              title="Delete todos"
                            > 
                            Remove
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
