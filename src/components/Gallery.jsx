import  { useState } from 'react';

const Gallery = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const showPrevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 row-span-2">
          <img
            src={images[0]}
            alt="Main"
            className="w-full h-full object-cover rounded-lg cursor-pointer"
            onClick={() => openModal(0)}
          />
        </div>
        <div className="col-span-1">
          <img
            src={images[1]}
            alt="Secondary 1"
            className="w-full h-full object-cover rounded-lg cursor-pointer"
            onClick={() => openModal(1)}
          />
        </div>
        <div className="col-span-1">
          <img
            src={images[2]}
            alt="Secondary 2"
            className="w-full h-full object-cover rounded-lg cursor-pointer"
            onClick={() => openModal(2)}
          />
        </div>
      </div>
      <button
        onClick={() => openModal(0)}
        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        Show more photos
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <button onClick={closeModal} className="absolute top-4 right-4 text-white text-xl">
            &times;
          </button>
          <button onClick={showPrevImage} className="absolute left-4 text-white text-xl">
            &lt;
          </button>
          <img
            src={images[selectedImageIndex]}
            alt="Selected"
            className="max-w-full max-h-full"
          />
          <button onClick={showNextImage} className="absolute right-4 text-white text-xl">
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
