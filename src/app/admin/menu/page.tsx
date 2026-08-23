"use client"

import { useEffect, useState } from "react"
import {
  Edit,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
const MENU_CATEGORIES = [
  "Coffee",
  "Cold Coffee",
  "Tea",
  "Milkshakes",
  "Smoothies",
  "Fresh Juices",
  "Mocktails",
  "Breakfast",
  "Snacks",
  "Momo",
  "Sandwiches",
  "Burgers",
  "Pizza",
  "Pasta",
  "Main Course",
  "Salads",
  "Desserts",
  "Cakes",
  "Bakery",
]

const emptyForm = (sortOrder = 0) => ({
  title: "",
  description: "",
  image: "",
  price: "",
  category: "",
  isPopular: false,
  isAvailable: true,
  sortOrder,
})

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState(emptyForm())

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch menu items")
      }

      setMenuItems(await response.json())
    } catch (error) {
      console.error("Error fetching menu items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const closeForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData(emptyForm(menuItems.length))
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    // 5 MB validation
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.")
      event.target.value = ""
      return
    }

    setIsUploading(true)

    try {
      const uploadData = new FormData()

      uploadData.append("file", file)
      uploadData.append("folder", "menu")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload image"
        )
      }

      setFormData((current) => ({
        ...current,
        image: data.url,
      }))
    } catch (error) {
      console.error("Error uploading menu image:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload menu image"
      )
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    try {
      const response = await fetch(
        editingItem
          ? `/api/menu/${editingItem.id}`
          : "/api/menu",
        {
          method: editingItem ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.error || "Failed to save menu item"
        )
        return
      }

      await fetchMenuItems()
      closeForm()
    } catch (error) {
      console.error("Error saving menu item:", error)
      alert("Failed to save menu item")
    }
  }

  const handleEdit = (menuItem: MenuItem) => {
    setEditingItem(menuItem)

    setFormData({
      title: menuItem.title,
      description: menuItem.description || "",
      image: menuItem.image || "",
      price: menuItem.price,
      category: menuItem.category || "",
      isPopular: menuItem.isPopular,
      isAvailable: menuItem.isAvailable,
      sortOrder: menuItem.sortOrder,
    })

    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this menu item?")) {
      return
    }

    try {
      const response = await fetch(
        `/api/menu/${id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error(
          "Failed to delete menu item"
        )
      }

      await fetchMenuItems()
    } catch (error) {
      console.error(
        "Error deleting menu item:",
        error
      )

      alert("Failed to delete menu item")
    }
  }

  if (isLoading) {
    return (
      <div
        className="p-6"
        style={{ color: "#756E68" }}
      >
        Loading menu items…
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#F7F4EF" }}
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#292522" }}
          >
            Menu Management
          </h1>

          <p
            className="text-sm"
            style={{ color: "#756E68" }}
          >
            Mark items as popular to show them on
            the homepage.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null)
            setFormData(
              emptyForm(menuItems.length)
            )
            setShowForm(true)
          }}
          style={{
            backgroundColor: "#7A4E2D",
            color: "#FFFFFF",
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* HORIZONTAL MENU ITEMS */}
     {/* MENU ITEMS - 4 ITEMS VISIBLE */}
{/* MENU ITEMS - 4 CARDS PER ROW */}
{menuItems.length > 0 && (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {menuItems.map((menuItem) => (
      <Card
        key={menuItem.id}
        className="overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E7DED4",
        }}
      >
        {/* IMAGE */}
        {menuItem.image ? (
          <img
            src={menuItem.image}
            alt={menuItem.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div
            className="flex h-48 items-center justify-center"
            style={{
              backgroundColor: "#F7F4EF",
            }}
          >
            <ImageIcon
              className="h-12 w-12"
              style={{
                color: "#B68A52",
              }}
            />
          </div>
        )}

        {/* CONTENT */}
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                className="truncate font-semibold"
                style={{
                  color: "#292522",
                }}
              >
                {menuItem.title}
              </h2>

              {menuItem.category && (
                <p
                  className="text-xs"
                  style={{
                    color: "#756E68",
                  }}
                >
                  {menuItem.category}
                </p>
              )}
            </div>

            <p
              className="whitespace-nowrap font-semibold"
              style={{
                color: "#7A4E2D",
              }}
            >
              {menuItem.price}
            </p>
          </div>

          {/* DESCRIPTION */}
          {menuItem.description && (
            <p
              className="mb-4 line-clamp-2 text-sm"
              style={{
                color: "#756E68",
              }}
            >
              {menuItem.description}
            </p>
          )}

          {/* STATUS + ACTIONS */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {menuItem.isPopular && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    px-2
                    py-1
                    text-xs
                  "
                  style={{
                    backgroundColor: "#FFF3CD",
                    color: "#7A4E2D",
                  }}
                >
                  <Star className="h-3 w-3 fill-current" />
                  Popular
                </span>
              )}

              {!menuItem.isAvailable && (
                <span
                  className="rounded-full px-2 py-1 text-xs"
                  style={{
                    backgroundColor: "#E7DED4",
                    color: "#756E68",
                  }}
                >
                  Unavailable
                </span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(menuItem)}
                aria-label={`Edit ${menuItem.title}`}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(menuItem.id)}
                aria-label={`Delete ${menuItem.title}`}
                style={{
                  color: "#B94A48",
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}

      {/* EMPTY STATE */}
      {menuItems.length === 0 && (
        <Card
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E7DED4",
          }}
        >
          <CardContent
            className="p-10 text-center"
            style={{
              color: "#756E68",
            }}
          >
            No menu items yet. Add items and mark them
            Popular to show them on the homepage.
          </CardContent>
        </Card>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >
          <Card
            className="
              max-h-[90vh]
              w-full
              max-w-xl
              overflow-y-auto
            "
            style={{
              backgroundColor: "#FFFFFF",
            }}
          >
            <CardHeader>
              <CardTitle
                style={{
                  color: "#292522",
                }}
              >
                {editingItem
                  ? "Edit Menu Item"
                  : "Add Menu Item"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* NAME + PRICE */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Name *
                    </label>

                    <Input
                      required
                      value={formData.title}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          title:
                            event.target.value,
                        })
                      }
                      placeholder="e.g. Classic Chicken Burger"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Price *
                    </label>

                    <Input
                      required
                      value={formData.price}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          price:
                            event.target.value,
                        })
                      }
                      placeholder="e.g. Rs. 350"
                    />
                  </div>
                </div>

                {/* CATEGORY */}
                {/* CATEGORY */}
<div>
  <label className="mb-2 block text-sm font-medium">
    Category
  </label>

  <select
    value={formData.category}
    onChange={(event) =>
      setFormData({
        ...formData,
        category: event.target.value,
      })
    }
    className="
      w-full
      rounded-lg
      border
      border-gray-300
      bg-white
      px-3
      py-2.5
      text-sm
      text-[#292522]
      outline-none
      transition
      focus:border-[#7A4E2D]
      focus:ring-2
      focus:ring-[#7A4E2D]/20
    "
  >
    <option value="">
      Select a category
    </option>

    {MENU_CATEGORIES.map((category) => (
      <option
        key={category}
        value={category}
      >
        {category}
      </option>
    ))}
  </select>
</div>

                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        description:
                          event.target.value,
                      })
                    }
                    rows={3}
                    className="
                      w-full
                      rounded-lg
                      border
                      p-3
                      outline-none
                      focus:ring-2
                      focus:ring-[#7A4E2D]
                    "
                    placeholder="Short description"
                  />
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Menu Image
                  </label>

                  {formData.image && (
                    <div className="relative mb-3 h-44 overflow-hidden rounded-lg">
                      <img
                        src={formData.image}
                        alt="Menu preview"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="
                          absolute
                          right-2
                          top-2
                          bg-white/90
                        "
                        onClick={() =>
                          setFormData({
                            ...formData,
                            image: "",
                          })
                        }
                      >
                        <X className="h-4 w-4" />

                        <span className="sr-only">
                          Remove image
                        </span>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={
                        handleImageUpload
                      }
                    />

                    <Upload
                      className="h-5 w-5"
                      style={{
                        color: "#7A4E2D",
                      }}
                    />
                  </div>

                  <p
                    className="mt-2 text-xs"
                    style={{
                      color: "#756E68",
                    }}
                  >
                    {isUploading
                      ? "Uploading to Cloudinary…"
                      : "Upload an image from your computer (max 5 MB)."}
                  </p>
                </div>

                {/* CHECKBOXES */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={
                        formData.isPopular
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          isPopular:
                            event.target
                              .checked,
                        })
                      }
                    />

                    Show in Popular Menu
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={
                        formData.isAvailable
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          isAvailable:
                            event.target
                              .checked,
                        })
                      }
                    />

                    Available
                  </label>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={closeForm}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1"
                    style={{
                      backgroundColor:
                        "#7A4E2D",
                      color: "#FFFFFF",
                    }}
                  >
                    {isUploading
                      ? "Uploading…"
                      : editingItem
                        ? "Update"
                        : "Add Item"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}