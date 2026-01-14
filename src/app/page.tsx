import { api } from "~/trpc/server";
import CreateToDo from "./_components/CreateToDo";
import Header from "./_components/Header";
import ToDoList from "./_components/ToDoList";

export default async function Home() {
	const toDos = await api.post.getAll();

	return (
		<div className="relative min-h-screen bg-black overflow-hidden">
			<div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>
			<div className="fixed top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
			<div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>

			<div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl">
					<Header />
					<CreateToDo />
					<ToDoList toDos={toDos} />
				</div>
			</div>
		</div>
	);
}
