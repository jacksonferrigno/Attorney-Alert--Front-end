"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';  // Import useUser hook from Clerk
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import AA_LOGO from '/public/AA_LOGO.png';  

export default function Home() {
  const { isSignedIn } = useUser();  // Check if the user is signed in
  const router = useRouter();  // For redirecting to attorney-info page
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowFloatingCTA(window.pageYOffset > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      router.push('/attorney-info');  // Redirect to the attorney-info page if not signed in
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/">
            <Image 
              src={AA_LOGO} 
              alt="Attorney Alert Logo" 
              className="logo"
            /> 
          </Link>
          <ul className="nav-links">
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li>
              <Link href="/attorney-info" className="nav-link" onClick={handleProtectedNavigation}>
                Leads Portal
              </Link>
            </li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Floating Call-to-Action Button */}
      <Link href="/attorney-info" className={`cta-floating-button ${showFloatingCTA ? 'visible' : 'hidden'}`} onClick={handleProtectedNavigation}>
        Boost Your Client Base
      </Link>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-layer"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 id="headline">Expand Your Client Base</h1>
          <p id="subtitle" className="subtitle">Connect with clients through innovative and refined tools</p>
          <Link href="/attorney-info" className="cta-button" onClick={handleProtectedNavigation}>
            Start Growing Now
          </Link>
        </div>
        <div className="scroll-down">↓</div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="reveal">Our Key Features</h2>
        <div className="features-container">
          <div className="feature-box reveal">
            <div className="icon">⚖️</div>
            <h3>Advanced Web Scraping</h3>
            <p>Effortlessly discover and connect with potential clients. Our tools generate over 15,000 potential leads each month.</p>
          </div>
          <div className="feature-box reveal">
            <div className="icon">🚀</div>
            <h3>Automated Lead Generation</h3>
            <p>Simplify your lead generation process with precision tools designed for efficiency.</p>
          </div>
          <div className="feature-box reveal">
            <div className="icon">🔔</div>
            <h3>Customizable Alerts</h3>
            <p>Receive real-time notifications tailored to your specific legal practice needs.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2 className="reveal">Our Services</h2>
        <div className="services-container">
          <div className="service-box reveal">
            <h3>Client Discovery</h3>
            <p>Identify new opportunities by discovering clients in need of your legal services.</p>
          </div>
          <div className="service-box reveal">
            <h3>Targeted Marketing</h3>
            <p>Reach out to potential clients with precision-targeted marketing strategies tailored for the legal field.</p>
          </div>
          <div className="service-box reveal">
            <h3>Client Retention</h3>
            <p>Maintain long-term relationships with your clients through continuous engagement and support.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="footer-section">
        <p>Contact Us: <a href="mailto:info@attorneyalert.com">info@attorneyalert.com</a> | (123) 456-7890</p>
        <p>&copy; 2024 Attorney Alert. All rights reserved.</p>
      </footer>
    </>
  );
}
