
export default function SignupLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf8] px-4 py-12">
      <div className="w-full max-w-[440px] animate-pulse rounded-2xl border border-[#e5ebe5] bg-white p-6 shadow-sm sm:p-9">
        <div className="mx-auto h-8 w-44 rounded bg-gray-200" />
        <div className="mx-auto mt-4 h-4 w-56 rounded bg-gray-200" />

        <div className="mt-8 space-y-4">
          <div className="h-12 rounded-xl bg-gray-200" />
          <div className="h-12 rounded-xl bg-gray-200" />
          <div className="h-12 rounded-xl bg-gray-200" />
          <div className="h-12 rounded-xl bg-gray-200" />
        </div>

        <div className="my-6 h-4 rounded bg-gray-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-xl bg-gray-200" />
          <div className="h-12 rounded-xl bg-gray-200" />
        </div>

        <div className="mx-auto mt-7 h-4 w-52 rounded bg-gray-200" />
      </div>
    </main>
  );
}
