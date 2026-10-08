"use client";
import { useState, useEffect } from "react";
import { authFetch } from "@/lib/authFetch";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category?")) return;
    await authFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Categories</h1>
      <button onClick={() => setEditing({ name: "", slug: "", status: "Active" })}>Add Category</button>
      
      {editing && (
        <form onSubmit={saveCategory} style={{ margin: "20px 0", padding: "20px", border: "1px solid #ccc" }}>
          <h3>{editing.id ? "Edit Category" : "New Category"}</h3>
          <input
            placeholder="Name"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            required
          />
          <input
            placeholder="Slug"
            value={editing.slug}
            onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            required
          />
          <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(null)}>Cancel</button>
        </form>
      )}

      {loading ? <p>Loading...</p> : (
        <table style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.status}</td>
                <td>
                  <button onClick={() => setEditing(c)}>Edit</button>
                  <button onClick={() => deleteCategory(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
