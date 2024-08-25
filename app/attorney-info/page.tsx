"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser, SignInButton } from "@clerk/nextjs";  // Import necessary hooks from Clerk
import { lookupFloridaBarMember } from "./floridaBarLookup";
import "./attorney-info.css";
import AA_LOGO from '/public/AA_LOGO.png';

export default function AttorneyInfo() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();  // Get the user and their authentication status
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Set email after the user signs in
  useEffect(() => {
    if (isSignedIn) {
      setEmail(user?.primaryEmailAddress?.emailAddress || "");
      router.push("/dashboard");  // Redirect to the dashboard if the user is signed in
    }
  }, [isSignedIn, router, user]);

  const handleReview = () => {
    if (!firstName || !lastName || !practiceName || !barNumber || !email || !phoneNumber || !consent) {
      setError("Please fill out all fields and give consent.");
      return;
    }

    // Show the confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);

    try {
      // Perform Florida Bar lookup
      const barLookupResult = await lookupFloridaBarMember(barNumber, `${firstName} ${lastName}`);
      if (!barLookupResult.success) {
        setError(barLookupResult.message);
        return;
      }

      // Prepare data to send to the API
      const data = {
        firstName,
        lastName,
        practiceName,
        barNumber,
        email,
        phoneNumber,
        consent,
      };

      // Submit data to the backend
      const response = await fetch('/api/storeAttorneyInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Attorney information stored successfully");
        router.push("/payment");  // Redirect to payment page after successful API call
      } else {
        const responseData = await response.json();
        setError(responseData.error || "Failed to submit information.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit information. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
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
            <li><Link href="/#features" className="nav-link">Features</Link></li>
            <li><Link href="/#services" className="nav-link">Services</Link></li>
            <li><Link href="/register" className="nav-link">Leads Portal</Link></li>
            <li><Link href="/#contact" className="nav-link">Contact</Link></li>
          </ul>
        </div>
      </nav>

      <div className="attorney-info-page">
        {!isSignedIn ? (
          <div className="sign-in-container">
            <h1>Sign In or Sign Up to Continue</h1>
            <p>To access this page, please sign in or create a new account.</p>
            <SignInButton mode="modal" afterSignInUrl="/attorney-info" afterSignUpUrl="/attorney-info" />
          </div>
        ) : (
          <div>
            <h1>Complete Your Registration</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleReview(); }}>
              {error && <p className="error">{error}</p>}
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="practiceName">Name of Practice</label>
                <input
                  id="practiceName"
                  type="text"
                  placeholder="Name of Practice"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="barNumber">Bar Number</label>
                <input
                  id="barNumber"
                  type="text"
                  placeholder="Bar Number"
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="consent">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  I consent to receive messages and emails.
                </label>
              </div>
              <button type="submit">Review Information</button>
            </form>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <h2>Confirm Your Information</h2>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Name of Practice:</strong> {practiceName}</p>
            <p><strong>Bar Number:</strong> {barNumber}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone Number:</strong> {phoneNumber}</p>
            <div className="confirmation-buttons">
              <button onClick={handleConfirmSubmit}>Proceed to Payment</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
