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
				<div className="relative flex-1 group">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="What needs to be done today?"
						className="w-full bg-transparent border-b-2 border-gray-800 px-0 py-4 text-white text-lg placeholder-gray-600 transition-all duration-300 focus:border-red-600 focus:outline-none"
					/>
					<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 group-focus-within:w-full"></div>
				</div>

				<button
					type="submit"
					disabled={!name.trim()}
					className="relative overflow-hidden bg-transparent border border-gray-800 px-8 py-4 text-white font-light tracking-widest uppercase text-sm transition-all duration-300 hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed group"
				>
					<span className="relative z-10">Add</span>
					<div className="absolute inset-0 bg-red-600/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
				</button>
			</form>
		</div>
	);
}
