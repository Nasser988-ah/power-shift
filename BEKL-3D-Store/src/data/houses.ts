export type House = {
  id: string
  name: string
  category: string
  blurb: string
  active: boolean
  trim: string
}

/** The fifteen houses of Power Shift Mall. Edit this list to change the street. */
export const houses: House[] = [
  { id: "bekl", name: "BEKL", category: "Fashion & Style", blurb: "Tailored clothing", active: true, trim: "#75B59A" },
  { id: "nourvive", name: "Nourvive", category: "Beauty & Wellness", blurb: "Botanical care", active: false, trim: "#C9897C" },
  { id: "uruz", name: "URUZ", category: "Accessories & Jewelry", blurb: "Gold and stones", active: false, trim: "#B9975B" },
  { id: "via", name: "VIA Holidays", category: "Travel & Tourism", blurb: "Journeys and stays", active: false, trim: "#6E8CA6" },
  { id: "availio", name: "Availio", category: "Lifestyle", blurb: "Everyday living", active: false, trim: "#A89474" },
  { id: "haseb", name: "7aseb", category: "Business & Digital Tools", blurb: "Work and software", active: false, trim: "#75B59A" },
  { id: "luna", name: "Luna Beauty", category: "Cosmetics & Skincare", blurb: "Color and skin", active: false, trim: "#C488A2" },
  { id: "zaytoon", name: "Zaytoon", category: "Organic Food", blurb: "Olive and pantry", active: false, trim: "#6E8F72" },
  { id: "tasty", name: "Tasty Box", category: "Food & Snacks", blurb: "Small-batch bites", active: false, trim: "#C4896A" },
  { id: "fekra", name: "Fekra", category: "Books & Gifts", blurb: "Reading and objects", active: false, trim: "#8C7B62" },
  { id: "raha", name: "Raha Home", category: "Home Decor", blurb: "Calm interiors", active: false, trim: "#9A8B7E" },
  { id: "mishmish", name: "Mishmish Kids", category: "Kids & Toys", blurb: "Play and clothing", active: false, trim: "#D09A62" },
  { id: "fitzone", name: "FitZone", category: "Sportswear", blurb: "Training apparel", active: false, trim: "#9BB0C4" },
  { id: "bloom", name: "Bloom", category: "Flowers & Gifts", blurb: "Stems and wrapping", active: false, trim: "#75B59A" },
  { id: "pixel", name: "Pixel Tech", category: "Electronics", blurb: "Devices and audio", active: false, trim: "#172B43" },
]
