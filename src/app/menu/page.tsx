import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import MenuFilter from "./MenuFilter"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Menu - Cherdung Café",
  description:
    "Explore our coffee, food, and café favorites.",
}

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
  })

  return (
    <div className="min-h-screen bg-[#F8FAFB]">

      {/* ================= MENU SECTION ================= */}
      <section className="bg-[#F8FAFB] py-12 sm:py-16 md:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ================= MENU HEADER ================= */}
          <div className="mb-8 sm:mb-10 text-center">
            <p
              className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#8096A3] font-sans"
            >
              Taste Something Special
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.03em] text-[#29343A] font-serif leading-tight"
            >
              Our Favorites
            </h2>
            <p
              className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-[#737D83] font-sans tracking-wide"
            >
              Explore our freshly prepared menu
            </p>
          </div>

          {/* ================= CLIENT FILTER ================= */}
          {menuItems.length > 0 ? (
            <MenuFilter menuItems={menuItems} />
          ) : (

            <div
              className="rounded-3xl border border-[#DDE5E9] bg-white px-4 sm:px-6 py-16 sm:py-20 text-center shadow-sm"
            >

              <div
                className="mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EAF0F4]"
              >
                <div
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-[#718794] border-t-transparent opacity-70"
                />
              </div>

              <p
                className="text-xs sm:text-sm md:text-base leading-6 text-[#737D83] font-sans tracking-wide"
              >
                Our menu is being prepared.
                Please check back soon.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  )
}
