
import { useState } from 'react';

function ProductForm({ onSave, editingProduct, onCancel }) {
  const [form, setForm] = useState({
    name: editingProduct?.name ?? '',
    category: editingProduct?.category ?? '',
    price: editingProduct?.price ?? '',
    stock: editingProduct?.stock ?? ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Product name is required!');
      return;
    }

    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    });

    setForm({
      name: '',
      category: '',
      price: '',
      stock: ''
    });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <h4 className="mb-3">
          {editingProduct ? 'Update Product' : 'Add New Product'}
        </h4>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Category</label>
            <input
              className="form-control"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>

          {editingProduct && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
