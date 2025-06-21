import React, { useState, useEffect } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Check, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const BookingPage = () => {
  // const { id: listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // console.log(listingId);

  // Function to get the user ID from the token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId; // Adjust this based on the actual structure of your token
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Invalid token');
  }
};
  
  // Booking data from PriceDisplay component
  const bookingData = location.state;
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });
  
  // Booking process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No booking data found</h2>
          <p className="text-gray-600 mb-4">Please start your booking from the listing page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setPaymentForm(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formatted.length <= 5) {
        setPaymentForm(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Limit CVV to 3 digits
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '');
      if (formatted.length <= 3) {
        setPaymentForm(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardholderName, email } = paymentForm;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      setErrorMessage('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!expiryDate || expiryDate.length !== 5) {
      setErrorMessage('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!cvv || cvv.length !== 3) {
      setErrorMessage('Please enter a valid 3-digit CVV');
      return false;
    }
    
    if (!cardholderName.trim()) {
      setErrorMessage('Please enter the cardholder name');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleBookingSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsProcessing(true);
  setErrorMessage('');

  try {
    const guestId = getUserIdFromToken(); // Get the user ID from the token
    console.log('Guest ID being used:', guestId);
    const bookingPayload = {
      listing: bookingData.listingId,
      guest: guestId, // Include the guest ID from the token
      checkIn: new Date(bookingData.checkIn).toISOString(),
      checkOut: new Date(bookingData.checkOut).toISOString(),
      guests: bookingData.numberOfGuests,
      totalPrice: bookingData.totalPrice,
    };

    console.log('Sending booking payload:', bookingPayload);

    const response = await axios.post('https://ulbservice.onrender.com/api/bookings/', bookingPayload);
    
    if (response.status === 201) {
      console.log('Booking created:', response.data);
      setTimeout(() => {
        setBookingStatus('success');
      }, 2000);
    } else {
      throw new Error('Failed to create booking');
    }
  } catch (error) {
    console.error('Booking error:', error);
    setErrorMessage('Failed to process booking. Please try again.');
    setBookingStatus('error');
  } finally {
    setIsProcessing(false);
  }
};


  // Success state
  if (bookingStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Booking ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p>Check-in: {formatDate(bookingData.checkIn)}</p>
            <p>Check-out: {formatDate(bookingData.checkOut)}</p>
            <p>Total: ${bookingData.totalPrice}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Review your booking details and complete payment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Booking Details
            </h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Stay Duration</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Check-in:</span> {formatDate(bookingData.checkIn)}</p>
                  <p><span className="font-medium">Check-out:</span> {formatDate(bookingData.checkOut)}</p>
                  <p><span className="font-medium">Duration:</span> {bookingData.numberOfNights} night{bookingData.numberOfNights !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Guests
                </h3>
                <p className="text-sm text-gray-600">
                  {bookingData.numberOfGuests} guest{bookingData.numberOfGuests !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Price Breakdown</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>${bookingData.pricePerNight} × {bookingData.numberOfNights} night{bookingData.numberOfNights !== 1 ? 's' : ''} × {bookingData.numberOfGuests} guest{bookingData.numberOfGuests !== 1 ? 's' : ''}</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={paymentForm.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={paymentForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentForm.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentForm.cvv}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={paymentForm.cardholderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              {errorMessage && (
                <div className="flex items-center p-3 text-sm text-red-800 bg-red-50 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errorMessage}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Complete Booking - $${bookingData.totalPrice}`
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                By completing this booking, you agree to our terms of service and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;