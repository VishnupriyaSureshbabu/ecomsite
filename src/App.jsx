
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // cart page 
  const [showCart, setShowCart] = useState(false);

  // skip
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch products
  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products?limit=10&skip=${skip}`)
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.total);
      })
      .catch((error) => console.log(error));
  }, [skip]);

  // Add to Cart
  function addToCart(product) {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) => item.id === product.id &&  item.quantity < item.stock  ? { ...item, quantity: item.quantity + 1 }  : item
        );
      }

      return [
        ...prevCart,
        { ...product, quantity: 1 },
      ];
    });
  }

  // Increase Quantity
  function increaseQuantity(id) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Decrease Quantity
  function decreaseQuantity(id) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  // Remove Product
  function removeFromCart(id) {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  }

  // Total Cart Items
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // nextpage
  function nextPage() {
    if (skip + 10 < total) {
      setSkip(skip + 10);
    }
  }

  function previousPage() {
    if (skip >= 10) {
      setSkip(skip - 10);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          E-commerce Website
        </h1>

        {/* My Cart Button */}
        <button
          onClick={() => setShowCart(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-bold"
        >
          My Cart ({totalItems})
        </button>

      </div>

      {/* PRODUCTS PAGE */}
      {!showCart && (

        <div>

          <h2 className="text-2xl font-bold mb-5">
            Products
          </h2>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-white p-5 rounded-lg shadow"
              >

                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-contain"
                />

                <h2 className="text-xl font-bold mt-4">
                  {product.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  ${product.price}
                </p>

                {/* Stock */}
                <p className="mt-2">

                  {product.stock === 0 ? (
                    <span className="text-red-500 font-bold">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="text-green-600">
                      In Stock: {product.stock}
                    </span>
                  )}

                </p>

                {/* Add to Cart */}
                <button
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                  className={`mt-4 px-4 py-2 rounded text-white ${
                    product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>

              </div>

            ))}

          </div>

          {/* Pagination BELOW PRODUCTS */}
          <div className="flex justify-center items-center gap-6 mt-10 mb-8">

            <button
              onClick={previousPage}
              disabled={skip === 0}
              className="bg-gray-500 text-white px-6 py-2 rounded disabled:bg-gray-300"
            >
              Previous
            </button>

            <span className="font-bold">
              Page {Math.floor(skip / 10) + 1} of {Math.ceil(total / 10)}
            </span>

            <button
              onClick={nextPage}
              disabled={skip + 10 >= total}
              className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-300"
            >
              Next
            </button>

          </div>

        </div>

      )}

      {/* MY CART PAGE */}
      {showCart && (

        <div className="bg-white p-6 rounded-lg shadow">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold">
              My Cart
            </h2>

            <button
              onClick={() => setShowCart(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded"
            >
              Back to Products
            </button>

          </div>

          {cart.length === 0 ? (

            <p className="text-gray-500 text-lg">
              Your cart is empty!
            </p>

          ) : (

            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between border-b pb-5 gap-4"
                >

                  {/* Product Details */}
                  <div className="flex items-center gap-5">

                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-24 object-contain"
                    />

                    <div>

                      <h3 className="font-bold text-lg">
                        {item.title}
                      </h3>

                      <p className="text-gray-600">
                        Price: ${item.price}
                      </p>

                    </div>

                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">

                    <button
                      disabled={item.quantity === 1}
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-300 px-4 py-2 rounded disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      disabled={item.quantity >= item.stock}
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-40"
                    >
                      +
                    </button>

                  </div>

                  {/* Subtotal and Remove */}
                  <div className="text-center">

                    {/* <p className="font-bold mb-2">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p> */}

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default App;
