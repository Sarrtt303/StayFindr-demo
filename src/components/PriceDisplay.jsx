import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveCalendar from '../components/Calendar'; // Ensure the path is correct

const PriceDisplay = ({ pricePerNight, listingId }) => {
  const navigate = useNavigate();
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [showCalendar, setShowCalendar] = useState(false);
  const [totalPrice, setTotalPrice] = useState(pricePerNight);

  useEffect(() => {
  const { startDate, endDate } = dateRange;

  // console.log('🟡 useEffect triggered');
  // console.log('Start Date:', startDate);
  // console.log('End Date:', endDate);
  // console.log('Guests:', numberOfGuests);
  // console.log('Price per night:', pricePerNight);

  let newTotalPrice = pricePerNight * numberOfGuests;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isNaN(start) && !isNaN(end)) {
      const timeDiff = end - start;
      const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (numberOfNights > 0) {
        newTotalPrice = numberOfNights * pricePerNight * numberOfGuests;
        console.log(`✅ Calculated for ${numberOfNights} nights:`, newTotalPrice);
      } else {
        console.log('⚠️ Invalid date range. Using fallback.');
      }
    } else {
      console.log('🔴 Invalid date objects. Using fallback.');
    }
  } else {
    console.log('ℹ️ Partial data — using fallback:', newTotalPrice);
  }

  setTotalPrice(newTotalPrice);
}, [dateRange, numberOfGuests, pricePerNight]);



  const handleBookNow = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const bookingData = {
      listingId,
      checkIn: dateRange.startDate.toISOString(),
      checkOut: dateRange.endDate.toISOString(),
      numberOfNights: Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)),
      pricePerNight,
      totalPrice,
      numberOfGuests,
    };

    navigate(`/booking/${listingId}`, { state: bookingData });
  };

  const handleDateChange = (range) => {
  setDateRange({ startDate: range.startDate, endDate: range.endDate });
  setShowCalendar(true);
};


  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Price per night</h3>

      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-bold">${pricePerNight}</span> per night
        </p>

        <div className="mt-4">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
            Number of Guests
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            value={numberOfGuests}
            onChange={(e) => {
              console.log('👥 Guests changed:', e.target.value);
              setNumberOfGuests(parseInt(e.target.value, 10) || 1);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
         <div className="flex justify-center">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-1/2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Select Dates for Total Pice
        </button>
        </div>

        {showCalendar && (
          <div className="mt-4">
            <InteractiveCalendar onDateChange={handleDateChange} />
          </div>
        )}

        {dateRange.startDate && dateRange.endDate && (
  <>
    <p className="text-sm text-gray-600">
      {Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24))} night
      {Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)) !== 1 ? 's' : ''} 
      for {numberOfGuests} guest{numberOfGuests !== 1 ? 's' : ''}
    </p>
    <p className="text-lg font-bold text-green-600">
      Total: ${totalPrice}
    </p>
  </>
)}
      </div>
        

      <div className="flex justify-center">
  <button
    onClick={handleBookNow}
    className="w-1/2 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
    disabled={!dateRange.startDate || !dateRange.endDate}
  >
    {!dateRange.startDate || !dateRange.endDate ? 'Book' : 'Book Now'}
  </button>
</div>

      {(!dateRange.startDate || !dateRange.endDate) && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Please select your check-in and check-out dates above
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;
