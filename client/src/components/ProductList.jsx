import ProductCard from './ProductCard.jsx'
function ProductList({products, onDelete, onEdit}){
    return(
        <>
      <div className="container mt-4">
      <div className="row g-3">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
           <ProductCard
              product={product}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ))}
      </div>
    </div>

        </>
    )
}
export default ProductList;