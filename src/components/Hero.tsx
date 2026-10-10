
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-[#F3FAF4]">
      <div className="mx-auto grid min-h-[360px] max-w-[1160px] grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-10 md:py-16 lg:px-8">
        
        {/* LEFT CONTENT */}
        <div className="text-center md:text-left">
          
          {/* EYEBROW */}
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
            🌿 প্রতিদিনের বাজারদর
          </span>

          {/* MAIN HEADING */}
          <h1 className="text-[30px] leading-[1.35] font-extrabold tracking-tight text-[#172B1C] sm:text-[38px] lg:text-[46px]">
            আজকের বাজারের দাম
            <br className="hidden sm:block" />
            <span className="text-[#079447]"> এক নজরে</span>
          </h1>

          {/* SUBTITLE */}
          <p className="mx-auto mt-5 max-w-[470px] text-sm leading-7 text-gray-600 md:mx-0 md:text-base">
            চাল, ডাল, তেল, মাছ, মাংস ও নিত্যপ্রয়োজনীয়
            পণ্যের সর্বশেষ বাজারদর জানুন সহজেই।
            প্রতিদিনের দামের ওঠানামা দেখুন এক জায়গায়।
          </p>

          {/* PRIMARY CTA */}
          <a
            href="#সব-পণ্য"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#079447] px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#067A3C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            সব পণ্যের দাম দেখুন
            <span className="ml-2" aria-hidden="true">→</span>
          </a>
        </div>

        {/* RIGHT BANNER IMAGE */}
        <div className="flex items-center justify-center">
          <Image
            src="/images/bazar-hero-1.png"
            alt="তাজা সবজি, ফলমূল ও নিত্যপ্রয়োজনীয় বাজারের পণ্য"
            width={520}
            height={400}
            priority
            className="h-auto w-full max-w-[460px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
