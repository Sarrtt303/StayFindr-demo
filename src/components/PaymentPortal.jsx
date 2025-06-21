import { useState } from 'react';

import axios from 'axios';


const PaymentPortal = ({ booking, onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Early return if booking data is not available
  if (!booking || !booking.checkIn || !booking.checkOut) {
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post(`https://ulbservice.onrender.com/api/bookings/${booking.listingId}`, {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        paymentMethod: paymentMethod,
        paymentStatus: 'completed'
      });

      onPaymentSuccess(response.data);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!booking?.checkIn || !booking?.checkOut) return 0;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Payment Portal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Check-in:</span> {booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Not selected'}</p>
            <p><span className="font-medium">Check-out:</span> {booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Not selected'}</p>
            <p><span className="font-medium">Guests:</span> {booking?.guests || 0}</p>
            <p><span className="font-medium">Nights:</span> {calculateNights()}</p>
            <p><span className="font-medium">Price per night:</span> ₹{booking?.pricePerNight || 0}</p>
            <hr className="my-2" />
            <p className="font-bold"><span>Total:</span> ₹{booking?.totalPrice || 0}</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              UPI
            </label>
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        )}

        {/* UPI Details */}
        {paymentMethod === 'upi' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@upi"
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : (
            `Pay ₹${booking?.totalPrice || 0}`
          )}
        </button>
      </div>
    </div>
  );
};
// // Payment Portal Component
// const PaymentPortal = ({ booking, onClose, onPaymentSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('card');
//   const [cardDetails, setCardDetails] = useState({
//     number: '',
//     expiry: '',
//     cvv: '',
//     name: ''
//   });

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       // Simulate payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const response = await axios.post(`https://ulbservice.onrender.com/api/bookings/${booking.listingId}`, {
//         checkIn: booking.checkIn,
//         checkOut: booking.checkOut,
//         guests: booking.guests,
//         totalPrice: booking.totalPrice,
//         paymentMethod: paymentMethod,
//         paymentStatus: 'completed'
//       });

//       onPaymentSuccess(response.data);
//     } catch (error) {
//       console.error('Payment failed:', error);
//       alert('Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateNights = () => {
//     const checkIn = new Date(booking.checkIn);
//     const checkOut = new Date(booking.checkOut);
//     return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Payment Portal</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-xl"
//           >
//             ×
//           </button>
//         </div>

//         {/* Booking Summary */}
//         <div className="bg-gray-50 p-4 rounded-lg mb-6">
//           <h3 className="font-semibold mb-2">Booking Summary</h3>
//           <div className="space-y-1 text-sm">
//             <p><span className="font-medium">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
//             <p><span className="font-medium">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}</p>
//             <p><span className="font-medium">Guests:</span> {booking.guests}</p>
//             <p><span className="font-medium">Nights:</span> {calculateNights()}</p>
//             <p><span className="font-medium">Price per night:</span> ₹{booking.pricePerNight}</p>
//             <hr className="my-2" />
//             <p className="font-bold"><span>Total:</span> ₹{booking.totalPrice}</p>
//           </div>
//         </div>

//         {/* Payment Method Selection */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Payment Method</label>
//           <div className="space-y-2">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="card"
//                 checked={paymentMethod === 'card'}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-2"
//               />
//               Credit/Debit Card
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="upi"
//                 checked={paymentMethod === 'upi'}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-2"
//               />
//               UPI
//             </label>
//           </div>
//         </div>

//         {/* Card Details Form */}
//         {paymentMethod === 'card' && (
//           <div className="space-y-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium mb-1">Card Number</label>
//               <input
//                 type="text"
//                 placeholder="1234 5678 9012 3456"
//                 value={cardDetails.number}
//                 onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div className="flex space-x-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium mb-1">Expiry</label>
//                 <input
//                   type="text"
//                   placeholder="MM/YY"
//                   value={cardDetails.expiry}
//                   onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
//                   className="w-full p-2 border rounded-md"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium mb-1">CVV</label>
//                 <input
//                   type="text"
//                   placeholder="123"
//                   value={cardDetails.cvv}
//                   onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
//                   className="w-full p-2 border rounded-md"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Cardholder Name</label>
//               <input
//                 type="text"
//                 placeholder="John Doe"
//                 value={cardDetails.name}
//                 onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//           </div>
//         )}

//         {/* UPI Details */}
//         {paymentMethod === 'upi' && (
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">UPI ID</label>
//             <input
//               type="text"
//               placeholder="yourname@upi"
//               className="w-full p-2 border rounded-md"
//             />
//           </div>
//         )}

//         {/* Payment Button */}
//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? (
//             <span className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Processing...
//             </span>
//           ) : (
//             `Pay ₹${booking.totalPrice}`
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// const ListingPage = () => {
//   const { id } = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
//   const [guests, setGuests] = useState(1);
//   const [showPaymentPortal, setShowPaymentPortal] = useState(false);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         const response = await axios.get(`https://ulbservice.onrender.com/api/listings/${id}`);
//         setListing(response.data);
//       } catch (err) {
//         setError('Failed to fetch listing');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchListing();
//   }, [id]);

//   const handleDateChange = (range) => {
//     setDateRange({ startDate: range.startDate, endDate: range.endDate });
//   };

//   const calculateTotalPrice = () => {
//     if (!dateRange.startDate || !dateRange.endDate || !listing) return 0;
    
//     const checkIn = new Date(dateRange.startDate);
//     const checkOut = new Date(dateRange.endDate);
//     const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
//     return nights * listing.price;
//   };

//   const handleBookNow = () => {
//     if (!dateRange.startDate || !dateRange.endDate) {
//       alert('Please select check-in and check-out dates');
//       return;
//     }

//     if (guests > listing.maxGuests) {
//       alert(`Maximum ${listing.maxGuests} guests allowed`);
//       return;
//     }

//     setShowPaymentPortal(true);
//   };

//   const handlePaymentSuccess = (bookingData) => {
//     setShowPaymentPortal(false);
//     alert('Booking confirmed! You will receive a confirmation email shortly.');
//     // You can redirect to a booking confirmation page here
//     // navigate('/booking-confirmation', { state: { booking: bookingData } });
//   };

//   const getBookingData = () => ({
//     listingId: id,
//     checkIn: dateRange.startDate,
//     checkOut: dateRange.endDate,
//     guests: guests,
//     pricePerNight: listing.price,
//     totalPrice: calculateTotalPrice()
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg text-gray-600">
//         Loading listing...
//       </div>
//     );
//   }

//   if (error || !listing) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500 text-lg">
//         {error || 'Listing not found'}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
//       <p className="text-gray-600 mb-4">{listing.description}</p>

//       {/* Image Gallery */}
//       <Gallery images={listing.images || []} />

//       {/* Amenities */}
//       <Amenities amenities={listing.amenities} />

//       {/* Booking Section */}
//       <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
//         <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>
        
//         {/* Guest Selection */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Number of Guests</label>
//           <select
//             value={guests}
//             onChange={(e) => setGuests(parseInt(e.target.value))}
//             className="w-full p-2 border rounded-md"
//           >
//             {[...Array(listing.maxGuests)].map((_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {i + 1} Guest{i + 1 > 1 ? 's' : ''}
//               </option>
//             ))}
//           </select>
//           <p className="text-sm text-gray-500 mt-1">Maximum {listing.maxGuests} guests</p>
//         </div>

//         {/* Calendar */}
//         <Calendar onDateChange={handleDateChange} />

//         {/* Price Display */}
//         <PriceDisplay 
//           pricePerNight={listing.price} 
//           dateRange={dateRange} 
//           guests={guests}
//         />

//         {/* Book Now Button */}
//         <button
//           onClick={handleBookNow}
//           disabled={!dateRange.startDate || !dateRange.endDate}
//           className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
//         >
//           {!dateRange.startDate || !dateRange.endDate ? 'Select Dates' : 'Book Now'}
//         </button>
//       </div>

//       {/* Payment Portal */}
//       {showPaymentPortal && (
//         <PaymentPortal
//           booking={getBookingData()}
//           onClose={() => setShowPaymentPortal(false)}
//           onPaymentSuccess={handlePaymentSuccess}
//         />
//       )}
//     </div>
//   );
// };

export default PaymentPortal;