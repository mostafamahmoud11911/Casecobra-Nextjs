import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
  { label: "Black", value: "black", tw: "zinc-900" },
  {
    label: "Blue",
    value: "blue",
    tw: "blue-950",
  },
  { label: "Red", value: "red", tw: "red-600" },
  { label: "Green", value: "green", tw: "green-600" },

  { label: "Orange", value: "orange", tw: "orange-600" },
] as const;

export const MODELS = {
  name: "models",
  options: [
    {
      label: "IPhone 11",
      value: "iphone11",
    },
    {
      label: "Iphone 12",
      value: "iphone12",
    },
    {
      label: "Iphone 13",
      value: "iphone13",
    },
    {
      label: "Iphone 14",
      value: "iphone14",
    },
    {
      label: "Iphone 15",
      value: "iphone15",
    },
    {
        label: "Iphone 16",
        value:"iphone16"
    }
  ],
} as const;


export const MATERIALS = {
    name: "materials",
    options: [
        {
            label: "Silicone",
            value: "silicone",
            description: undefined,
            price: PRODUCT_PRICES.material.silicone
        },
        {
            label: "Soft Polycarbonate",
            value: "polycarbonate",
            description: "Scratch-resistant coating",
            price: PRODUCT_PRICES.material.polycarbonate
        }
    ]
} as const

export const FINISHES = {
    name: "finishes",
    options: [
        {
            label: "Smooth Finish",
            value: "smooth",
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: "Textured",
            value: "textured",
            description: "Soft grippy texture",
            price: PRODUCT_PRICES.finish.textured
        }
    ]
} as const