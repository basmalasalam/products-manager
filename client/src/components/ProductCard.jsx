function ProductCard({product , onDelete, onEdit }){
    return(
        <>
         <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>

        <p className="card-text">
          <strong>Price:</strong> {product.price}
        </p>

        <p className="card-text">
          <strong>Category:</strong> {product.category}
        </p>

        <p className="card-text">
          <strong>Stock:</strong> {product.stock}
        </p>

        {product.stock === 0 && (
          <span className="badge bg-danger mb-3">
            Out of Stock
          </span>
        )}

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-warning" onClick={() => onEdit(product)}>
            <i className="fa-solid fa-pen-to-square me-1"></i>
            Edit
          </button>

          <button className="btn btn-danger" onClick={() => onDelete(product.id)}>
            <i className="fa-solid fa-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
        </>
    )
}
export default ProductCard;