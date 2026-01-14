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
			<div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
			<div className="relative h-full bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-lg p-6 transition-all duration-300 group-hover:border-gray-700 group-hover:shadow-xl group-hover:shadow-red-900/10">
				{isEditing ? (
					<div className="flex flex-col gap-4">
						<input
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							className="bg-transparent border-b border-gray-700 px-0 py-2 text-white focus:border-red-600 focus:outline-none"
							maxLength={256}
							autoFocus
						/>
						<div className="flex gap-2">
							<button
								onClick={() => handleUpdate(post.id)}
								disabled={!editName.trim() || updateToDo.isPending}
								className="text-gray-600 hover:text-white transition-colors"
							>
								Save
							</button>
							<button
								onClick={cancelEdit}
								className="text-gray-600 hover:text-white transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<button
								onClick={() => startEdit(post.id, post.name ?? "")}
								className="text-gray-600 hover:text-white transition-colors"
								title="Edit"
							>
								Edit
							</button>
							<button
								onClick={handleRemove}
								disabled={removeToDo.isPending}
								className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
								title="Remove"
							>
								Remove
							</button>
						</div>

						<div className="mb-6">
							<h3 className="text-white text-lg font-light leading-relaxed mb-2 break-words">
								{post.name}
							</h3>
						</div>

						<div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
							<div className="flex items-center gap-2 text-gray-600 text-xs">
								<span>
									{new Date(post.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
								</span>
							</div>
						</div>
						<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-600/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					</>
				)}
			</div>
		</div>
	);
}
