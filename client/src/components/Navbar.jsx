function Navbar({count}){

return(
    <>
   <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">
          Products Manager
        </span>

        <span className="badge bg-primary">
          Count: {count}
        </span>
      </div>
    </nav>
   
    </>
)
}
export default Navbar;