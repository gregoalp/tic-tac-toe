import Game from "@/components/Game";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Tic-Tac-Toe</h1>
      <Game />
    </main>
  );
}
