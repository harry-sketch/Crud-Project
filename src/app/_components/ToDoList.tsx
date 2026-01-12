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
               <p className="text-gray-600 font-light tracking-wide">No work for today!</p>
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-orange-600/5"></div>
          
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800 bg-gray-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-widest text-gray-600">
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
                          className="w-full bg-transparent border-b border-gray-700 px-0 py-1 text-white text-sm focus:border-red-600 focus:outline-none"
                          maxLength={256}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-white text-sm font-light">{post.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === post.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(post.id)}
                              disabled={!editName.trim() || updateToDo.isPending}
                              className="px-4 py-1.5 bg-green-600/10 border border-green-600/30 text-green-500 rounded text-xs uppercase tracking-wider hover:bg-green-600/20 transition-colors disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-1.5 bg-gray-800/50 border border-gray-700 text-gray-400 rounded text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(post.id, post.name ?? "")}
                              className="p-2 text-gray-600 hover:text-white transition-colors"
                              title="Edit todos"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemove(post.id)}
                              disabled={removeToDo.isPending}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
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
