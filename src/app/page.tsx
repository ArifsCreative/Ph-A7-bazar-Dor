
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Temporary anchor target for CTA testing */}
        <section
          id="সব-পণ্য"
          className="mx-auto min-h-[500px] max-w-[1160px] scroll-mt-6 px-4 py-16 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            সব পণ্য
          </h2>
          <p className="mt-3 text-gray-500">
            এখানে সব পণ্যের তালিকা দেখানো হবে।
          </p>
        </section>
      </main>
    </>
  );
}
