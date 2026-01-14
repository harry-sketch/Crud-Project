"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function CreateToDo() {
	const [name, setName] = useState("");
	const utils = api.useUtils();

	const createPost = api.post.create.useMutation({
		onSuccess: () => {
			void utils.post.getAll.invalidate();
			setName("");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			createPost.mutate({ name });
		}
	};

	return (
		<div className="mb-12">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
				<div className="group relative flex-1">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="What needs to be done today?"
						className="w-full border-gray-800 border-b-2 bg-transparent px-0 py-4 text-lg text-white placeholder-gray-600 transition-all duration-300 focus:border-red-600 focus:outline-none"
					/>
					<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 group-focus-within:w-full"></div>
				</div>

				<button
					type="submit"
					disabled={!name.trim()}
					className="group relative overflow-hidden border border-gray-800 bg-transparent px-8 py-4 font-light text-sm text-white uppercase tracking-widest transition-all duration-300 hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
				>
					<span className="relative z-10">Add</span>
					<div className="absolute inset-0 translate-y-full bg-red-600/10 transition-transform duration-300 group-hover:translate-y-0"></div>
				</button>
			</form>
		</div>
	);
}
