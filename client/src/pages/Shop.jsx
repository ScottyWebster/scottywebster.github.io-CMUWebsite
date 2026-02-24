import { useState } from "react";

const initialProducts = [
  {
    name: "Smartphone",
    image: "images/smartphone.jpg",
    price: 699,
    category: "Electronics",
  },
  {
    name: "Laptop",
    image: "images/laptop.jpg",
    price: 999,
    category: "Electronics",
  },
  { name: "Jeans", image: "images/jeans.jpg", price: 49, category: "Clothing" },
  // ... add the rest of your products here
];

export default function Shop() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState({
    Electronics: true,
    Clothing: true,
    Home: true,
  });

  const handleCategoryChange = (cat) => {
    setCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  let filtered = initialProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      categories[p.category],
  );

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name-asc")
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc")
    filtered.sort((a, b) => b.name.localeCompare(a.name));

  return (
    <section>
      <h2>Product Shop</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>

        <div>
          {["Electronics", "Clothing", "Home"].map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={categories[cat]}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="product-gallery">
        {filtered.map((p, index) => (
          <div className="product-card" key={index}>
            {/* Note: Ensure your images folder is moved to the public/ folder in Vite */}
            <img src={`/${p.image}`} alt={p.name} />
            <h3>{p.name}</h3>
            <p>Price: ${p.price}</p>
            <p>Category: {p.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
