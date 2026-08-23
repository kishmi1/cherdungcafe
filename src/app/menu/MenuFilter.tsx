"use client"

import { useMemo, useState } from "react"
import { Coffee, Star } from "lucide-react"

type MenuItem = {
  id: number
  title: string
  description: string | null
  image: string | null
  price: string
  category: string | null
  isPopular: boolean
  isAvailable: boolean
  sortOrder: number
}

type Props = {
  menuItems: MenuItem[]
}

export default function MenuFilter({ menuItems }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        menuItems
          .map((item) => item.category?.trim())
          .filter(
            (category): category is string => Boolean(category)
          )
      )
    )

    return ["All", ...uniqueCategories]
  }, [menuItems])

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return menuItems
    }

    return menuItems.filter(
      (item) => item.category?.trim() === selectedCategory
    )
  }, [menuItems, selectedCategory])

  return (
    <div>

      {/* ================= CATEGORY FILTER ================= */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={
                isActive
                  ? `
                    rounded-full
                    border
                    border-[#6F8494]
                    bg-[#6F8494]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:bg-[#5C7282]
                    hover:shadow-md
                  `
                  : `
                    rounded-full
                    border
                    border-[#D7E0E5]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-[#53616A]
                    shadow-sm
                    transition-all
                    duration-300
                    hover:border-[#9BAFBB]
                    hover:bg-[#EAF0F4]
                    hover:text-[#3E505B]
                  `
              }
            >
              {category}
            </button>
          )
        })}
      </div>


      {/* ================= RESULT COUNT ================= */}
      <div className="mb-8 text-center">
        <p className="text-sm text-[#737D83]">
          Showing{" "}
          <span className="font-semibold text-[#6F8494]">
            {filteredItems.length}
          </span>{" "}
          {filteredItems.length === 1 ? "item" : "items"}
        </p>
      </div>


      {/* ================= MENU GRID ================= */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {filteredItems.map((menuItem) => (
            <article
              key={menuItem.id}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#DDE5E9]
                bg-white
                shadow-[0_4px_18px_rgba(55,72,82,0.06)]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[#C4D2DA]
                hover:shadow-[0_15px_35px_rgba(55,72,82,0.13)]
              "
            >

              {/* ================= POPULAR BADGE ================= */}
              {menuItem.isPopular && (
                <div
                  className="
                    absolute
                    left-3
                    top-3
                    z-10
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#C28A4A]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-white
                    shadow-md
                  "
                >
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Popular
                </div>
              )}


              {/* ================= IMAGE ================= */}
              <div className="relative h-52 w-full overflow-hidden bg-[#EAF0F4]">

                {menuItem.image ? (
                  <img
                    src={menuItem.image}
                    alt={menuItem.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      bg-gradient-to-br
                      from-[#EAF0F4]
                      to-[#D8E2E8]
                    "
                  >
                    <Coffee className="h-14 w-14 text-[#6F8494]" />
                  </div>
                )}

                {/* Image Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/20
                    via-transparent
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

              </div>


              {/* ================= CONTENT ================= */}
              <div className="p-5">

                {/* CATEGORY */}
                {menuItem.category && (
                  <p
                    className="
                      mb-2
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#8096A3]
                    "
                  >
                    {menuItem.category}
                  </p>
                )}


                {/* TITLE + PRICE */}
                <div className="mb-3 flex items-start justify-between gap-3">

                  <h3
                    className="
                      line-clamp-2
                      text-lg
                      font-semibold
                      leading-snug
                      text-[#292F33]
                    "
                  >
                    {menuItem.title}
                  </h3>

                  <span
                    className="
                      shrink-0
                      whitespace-nowrap
                      rounded-full
                      bg-[#F3E9DE]
                      px-3
                      py-1
                      text-sm
                      font-bold
                      text-[#7A4E2D]
                    "
                  >
                    {menuItem.price}
                  </span>

                </div>


                {/* DIVIDER */}
                <div className="mb-3 h-px bg-[#E8EEF1]" />


                {/* DESCRIPTION */}
                {menuItem.description && (
                  <p
                    className="
                      line-clamp-3
                      text-sm
                      leading-6
                      text-[#737D83]
                    "
                  >
                    {menuItem.description}
                  </p>
                )}

              </div>

            </article>
          ))}

        </div>
      ) : (

        /* ================= EMPTY STATE ================= */
        <div
          className="
            rounded-3xl
            border
            border-[#DDE5E9]
            bg-white
            px-6
            py-20
            text-center
            shadow-sm
          "
        >

          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[#EAF0F4]
            "
          >
            <Coffee className="h-8 w-8 text-[#6F8494]" />
          </div>

          <h3
            className="
              text-lg
              font-semibold
              text-[#292F33]
            "
          >
            No items found
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-[#737D83]
            "
          >
            There are no menu items in this category.
          </p>

        </div>
      )}

    </div>
  )
}
