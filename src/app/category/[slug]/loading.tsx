
export default function Loading() {
  return (
    <div className="w-full">
      {/* CATEGORY HEADER SKELETON */}
      <div className="animate-pulse rounded-2xl border border-[#e1e9e2] bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gray-200" />

          <div className="space-y-3">
            <div className="h-6 w-32 rounded bg-gray-200" />
            <div className="h-4 w-52 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* SORT BAR SKELETON */}
      <div className="mt-8 flex items-center justify-between">
        <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* PRODUCT CARD SKELETONS */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-[#e1e9e2] bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gray-200" />

              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div className="space-y-3">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-6 w-28 rounded bg-gray-200" />
              </div>

              <div className="h-7 w-16 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
