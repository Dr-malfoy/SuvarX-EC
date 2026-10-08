const fs = require('fs');

const files = [
  '/Users/tanvirsamio/Downloads/suvarxnewsoft/frontend/app/admin/products/new/page.tsx',
  '/Users/tanvirsamio/Downloads/suvarxnewsoft/frontend/app/admin/products/[id]/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Add new fields to form state
  content = content.replace(
    /const \[form, setForm\] = useState\(\{ name: "", description: "", price: "", originalPrice: "", stockCount: "0", inStock: true, category: "car accessories", options: \[\] as string\[\], colors: \[\] as string\[\], colorInput: "", section: "" \}\);/,
    `const [form, setForm] = useState({ name: "", description: "", price: "", originalPrice: "", stockCount: "0", inStock: true, category: "Interior Accessories", options: [] as string[], colors: [] as string[], colorInput: "", section: "", sku: "", brand: "", shortDescription: "", specifications: "", compatibility: "", compatibleVehicles: "", installationInstructions: "", warrantyInformation: "", status: "Active", featured: false });`
  );
  
  // Also the fallback for [id]/page.tsx
  content = content.replace(
    /const \[form, setForm\] = useState\(\{ name: "", description: "", price: "", originalPrice: "", stockCount: "0", inStock: true, category: "Interior Accessories", options: \[\] as string\[\], colors: \[\] as string\[\], colorInput: "", section: "" \}\);/,
    `const [form, setForm] = useState({ name: "", description: "", price: "", originalPrice: "", stockCount: "0", inStock: true, category: "Interior Accessories", options: [] as string[], colors: [] as string[], colorInput: "", section: "", sku: "", brand: "", shortDescription: "", specifications: "", compatibility: "", compatibleVehicles: "", installationInstructions: "", warrantyInformation: "", status: "Active", featured: false });`
  );

  // Payload for POST/PUT
  const payloadRepl = `images: urls,
          image: urls[0] ?? "",
          badge: chosenSection === "sale" ? "sale" : chosenSection === "new_arrival" ? "new" : null,
          sku: form.sku, brand: form.brand, shortDescription: form.shortDescription, specifications: form.specifications, compatibility: form.compatibility, compatibleVehicles: form.compatibleVehicles, installationInstructions: form.installationInstructions, warrantyInformation: form.warrantyInformation, status: form.status, featured: form.featured`;
  
  content = content.replace(
    /images: urls,\s*image: urls\[0\] \?\? "",\s*badge: chosenSection === "sale" \? "sale" : chosenSection === "new_arrival" \? "new" : null/,
    payloadRepl
  );

  // Set effect for [id]/page.tsx to load new fields
  content = content.replace(
    /setForm\(\{ name: d\.name, description: d\.description \|\| "", price: d\.price, originalPrice: d\.originalPrice \|\| "", stockCount: String\(d\.stockCount \|\| 0\), inStock: !!d\.inStock, category: d\.category \|\| "Interior Accessories", options: d\.options \|\| \[\], colors: d\.colors \|\| \[\], colorInput: "", section: d\.section \|\| "" \}\);/,
    `setForm({ name: d.name, description: d.description || "", price: d.price, originalPrice: d.originalPrice || "", stockCount: String(d.stockCount || 0), inStock: !!d.inStock, category: d.category || "Interior Accessories", options: d.options || [], colors: d.colors || [], colorInput: "", section: d.section || "", sku: d.sku || "", brand: d.brand || "", shortDescription: d.shortDescription || "", specifications: d.specifications || "", compatibility: d.compatibility || "", compatibleVehicles: d.compatibleVehicles || "", installationInstructions: d.installationInstructions || "", warrantyInformation: d.warrantyInformation || "", status: d.status || "Active", featured: !!d.featured });`
  );

  // Add UI fields
  const uiFields = `
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input placeholder="SKU" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} style={inp} />
                <input placeholder="Brand" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} style={inp} />
              </div>
              <input placeholder="Short Description" value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} style={inp} />
`;

  content = content.replace(
    /<select value=\{form.category\}/,
    uiFields + '\n              <select value={form.category}'
  );

  const advancedFields = `
          <div style={card}>
            <span style={label}>Advanced Details</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Specifications (JSON or text)" value={form.specifications} onChange={e => setForm(p => ({ ...p, specifications: e.target.value }))} style={inp} />
              <input placeholder="Compatibility Notes" value={form.compatibility} onChange={e => setForm(p => ({ ...p, compatibility: e.target.value }))} style={inp} />
              <input placeholder="Compatible Vehicles (e.g. Honda Civic 2020+)" value={form.compatibleVehicles} onChange={e => setForm(p => ({ ...p, compatibleVehicles: e.target.value }))} style={inp} />
              <textarea placeholder="Installation Instructions" value={form.installationInstructions} rows={3} onChange={e => setForm(p => ({ ...p, installationInstructions: e.target.value }))} style={{ ...inp, resize: "vertical" }} />
              <input placeholder="Warranty Information" value={form.warrantyInformation} onChange={e => setForm(p => ({ ...p, warrantyInformation: e.target.value }))} style={inp} />
              <div style={{ display: "flex", gap: 12 }}>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inp, appearance: "none" }}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 14px", border: "0.5px solid rgba(0,0,0,0.15)", background: "#fafaf8", flex: 1 }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                  <span style={{ fontSize: "14px" }}>Featured Product</span>
                </div>
              </div>
            </div>
          </div>
`;

  content = content.replace(
    /<div style=\{card\}>\s*<span style=\{label\}>Description<\/span>/,
    advancedFields + '\n          <div style={card}>\n            <span style={label}>Description</span>'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated', file);
});
