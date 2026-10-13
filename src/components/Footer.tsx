
export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e1e9e2] bg-white">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-3 px-4 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:text-left lg:px-8">

        {/* left */}
        <p className="text-sm font-semibold text-[#1b2a1f]">
          বাজার দর
          <span className="font-normal text-gray-500">
            {" "}— প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </span>
        </p>

        {/* right */}
        <p className="text-xs leading-relaxed text-gray-500 sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>

      </div>
    </footer>
  );
}
