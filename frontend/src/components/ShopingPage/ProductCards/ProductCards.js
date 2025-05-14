import React from 'react';
import { products } from '../../../data/products';
import './ProductCards.css';

const ProductCards = ({ category = 'All Products', onAddToCart }) => {
  const filteredProducts = category === 'All Products' 
    ? products 
    : products.filter(product => product.category === category);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`fas fa-star ${i <= rating ? 'filled' : ''}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="products-section">
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="product-rating">
                <div className="stars">
                  {renderStars(product.rating)}
                </div>
                <span className="review-count">({product.reviews})</span>
              </div>
              <div className="product-price">
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => onAddToCart?.(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCards;
