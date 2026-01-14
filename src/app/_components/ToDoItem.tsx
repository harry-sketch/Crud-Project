"use client";

interface Post {
  id: number;
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface ToDoItemProps {
  post: Post;
  isEditing: boolean;
  editName: string;
  setEditName: (name: string) => void;
  startEdit: (id: number, name: string) => void;
  cancelEdit: () => void;
  handleUpdate: (id: number) => void;
  updateToDo: { isPending: boolean };
  removeToDo: { mutate: (data: { id: number }) => void; isPending: boolean };
}

export default function ToDoItem({
  post,
  isEditing,
  editName,
  setEditName,
  startEdit,
  cancelEdit,
  handleUpdate,
  updateToDo,
  removeToDo,
}: ToDoItemProps) {
  const handleRemove = () => {
    removeToDo.mutate({ id: post.id });
  };

  return (
    <div className="group relative h-full">
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 opacity-0 blur transition duration-500 group-hover:opacity-100"></div>
      <div className="relative h-full rounded-lg border border-gray-800 bg-gradient-to-br from-gray-950 to-gray-900 p-6 transition-all duration-300 group-hover:border-gray-700 group-hover:shadow-red-900/10 group-hover:shadow-xl">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border-gray-700 border-b bg-transparent px-0 py-2 text-white focus:border-red-600 focus:outline-none"
              maxLength={256}
            />
            <div className="flex gap-2">
              <button
			    type="button"
                onClick={() => handleUpdate(post.id)}
                disabled={!editName.trim() || updateToDo.isPending}
                className="text-gray-600 transition-colors hover:text-white"
              >
                Save
              </button>
              <button
			    type="button"
                onClick={cancelEdit}
                className="text-gray-600 transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
              <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
				  type="button"
                  onClick={() => startEdit(post.id, post.name ?? "")}
                  className="text-gray-600 transition-colors hover:text-white"
                  title="Edit"
                >
                Edit
                </button>
                <button
				                              type="button"

                  onClick={handleRemove}
                  disabled={removeToDo.isPending}
                  className="text-gray-600 transition-colors hover:text-red-600 disabled:opacity-50"
                  title="Remove"
                >
                  Remove
                </button>
              </div>

            <div className="mb-6">
              <h3 className="mb-2 break-words font-light text-lg text-white leading-relaxed">
                {post.name}
              </h3>
            </div>

            <div className="flex items-center justify-between border-gray-800/50 border-t pt-4">
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <span>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-lg bg-gradient-to-br from-red-600/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </>
        )}
      </div>
    </div>
  );
}
