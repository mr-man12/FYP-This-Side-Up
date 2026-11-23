export type Category = "Skimboards" | "T-Shirts" | "Jackets" | "Boardshorts" | "Accessories";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  image: string;
  blurb: string;
  sizes?: string[];
}

export const CATEGORIES: Category[] = [
  "Skimboards",
  "T-Shirts",
  "Jackets",
  "Boardshorts",
  "Accessories",
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "tide-fiberglass-48",
    name: 'Tide Classic Fiberglass 48"',
    category: "Skimboards",
    price: 129,
    stock: 14,
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80",
    blurb: "Fiberglass board for flatland and first waves. Hand-finished in Singapore.",
    sizes: ['44"', '48"', '52"'],
  },
  {
    id: "dusk-carbon-pro",
    name: "Dusk Carbon Pro",
    category: "Skimboards",
    price: 389,
    stock: 6,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    blurb: "Carbon-fibre foam core for wave riding. Light, snappy and built for Sentosa shore break.",
    sizes: ['50"', '52"', '54"'],
  },
  {
    id: "groms-foam-40",
    name: 'Groms Foam 40"',
    category: "Skimboards",
    price: 159,
    stock: 9,
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80",
    blurb: "Soft-top beginner board sized for kids and lighter riders.",
    sizes: ['38"', '40"'],
  },
  {
    id: "arc-traction",
    name: "Arc Traction Pad",
    category: "Accessories",
    price: 39,
    stock: 40,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    blurb: "Diamond-groove EVA grip pad. Peel, stick, ride.",
  },
  {
    id: "board-wax",
    name: "Tropical Board Wax (3-pack)",
    category: "Accessories",
    price: 15,
    stock: 80,
    image: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80",
    blurb: "Warm-water formula made for 28°C+ Singapore seas.",
  },
  {
    id: "tsu-tee",
    name: "This Side Up Classic Tee",
    category: "T-Shirts",
    price: 35,
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    blurb: "Heavyweight cotton tee with wave logo on chest.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sand-shorts",
    name: "Sandbar Boardshorts",
    category: "Boardshorts",
    price: 55,
    stock: 22,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    blurb: "4-way stretch boardshorts that dry before you are off the beach.",
    sizes: ["28", "30", "32", "34"],
  },
  {
    id: "spray-jacket",
    name: "Offshore Spray Jacket",
    category: "Jackets",
    price: 89,
    stock: 12,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    blurb: "Lightweight windbreaker for breezy evening sessions.",
    sizes: ["S", "M", "L", "XL"],
  },
];

export type ProductSort = "featured" | "az" | "za" | "low" | "high";

export function filterAndSortProducts(
  products: Product[],
  category: string,
  searchQuery: string,
  sort: ProductSort
): Product[] {
  return products
    .filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.blurb.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });
}
