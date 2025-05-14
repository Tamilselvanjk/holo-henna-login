import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../../../contexts/AuthContext'
import { useMobileMenu } from '../../hooks/useMobileMenu'
import { toast } from 'react-toastify'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const { isMenuOpen, toggleMenu, closeMenuOnLinkClick } = useMobileMenu()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  const isActive = (path) => location.pathname === path

  const renderProfileSection = () => {
    if (!isAuthenticated || !user) return null

    return (
      <div className="profile-section">
        <div className="profile-info" onClick={() => navigate('/profile')}>
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="user-name">{user.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt />
        </button>
      </div>
    )
  }

  return (
    <header>
      <div className="top-bar">
        <h1>HOLO HENNA MEHNDI ART</h1>
      </div>
      <nav className="navbar-head">
        <div className="menu">
          <span className="brand">Mehndi Artistry</span>

          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <Link
                to="/home"
                className={isActive('/home') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={isActive('/gallery') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                GALLERY
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={isActive('/shop') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                SHOP
              </Link>
            </li>
            <li>
              <Link
                to="#contact"
                className={isActive('#contact') ? 'active' : ''}
                onClick={closeMenuOnLinkClick}
              >
                CONTACT
              </Link>
            </li>
          </ul>

          <div className="nav-right">
            {isAuthenticated ? (
              renderProfileSection()
            ) : (
              <button onClick={() => navigate('/login')} className="login-btn">
                <FaUser /> Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header