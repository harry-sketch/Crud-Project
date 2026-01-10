export default function Header() {
  return (
    <header className="border-b-2 border-neutral-200 bg-black shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              TODO
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}