import React from 'react';
import AddressSelector from '../AddressSelector/AddressSelector';
import './ShopHeader.css';

const ShopHeader = ({ cartCount = 0, onCartClick }) => {
  return (
    <div className="header">
      <div className="container">
        <div className="header-actions">
          <AddressSelector />
          
          <div className="search-wrapper">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              aria-label="Search products"
            />
          </div>

          <button className="cart-button" onClick={onCartClick}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-text">Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
