import React from 'react'
import { useAnimation } from '../../hooks/useAnimation'
import './Hero.css'

const Hero = () => {
// Initialize animation hooks
  useAnimation()

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Experience the Art of Mehndi</h1>
        <p className="hero-text">Professional Mehndi Services for All Occasions</p>
        <a href="#booking" className="hero-button btn">Book Now</a>
      </div>
    </section>
  )
}

export default Hero
