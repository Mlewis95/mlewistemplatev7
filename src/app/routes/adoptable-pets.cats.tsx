import type { Route } from "./+types/adoptable-pets.cats";
import { useState } from "react";

interface Cat {
  id: number;
  name: string;
  age: string;
  size: string;
  gender: string;
  timeAtShelter: string;
  description: string;
  longDescription: string;
  photos: string[];
  breed: string;
  weight: string;
  energyLevel: string;
  goodWith: string[];
  medicalInfo: string;
  specialNeeds: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adoptable Cats - Kenton County Animal Shelter" },
    { name: "description", content: "Browse our adoptable cats looking for their forever homes. Filter by age and size." },
  ];
}

export default function AdoptableCats() {
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Sample cat data with photos
  const cats: Cat[] = [
    {
      id: 1,
      name: "Whiskers",
      age: "Senior",
      size: "Medium",
      gender: "Male",
      timeAtShelter: "10 months",
      description: "Whiskers is a wise senior cat who loves sunny spots and gentle pets. He's been waiting for his forever home for 10 months.",
      longDescription: "Whiskers is a 14-year-old Domestic Longhair who came to us when his previous owner could no longer care for him. Despite his age, he's still quite active and loves to explore. Whiskers is very affectionate and enjoys being brushed and sitting in sunny windows. He's litter-trained and well-behaved. Whiskers gets along well with other cats and would be perfect for a quiet household. He has some arthritis in his joints, so he needs a home without stairs. Whiskers is very loyal and will make a wonderful companion for someone who wants a calm, loving cat.",
      photos: [
        "/api/placeholder/400/300/gray/9E9E9E?text=Whiskers+1",
        "/api/placeholder/400/300/gray/BDBDBD?text=Whiskers+2",
        "/api/placeholder/400/300/gray/D3D3D3?text=Whiskers+3"
      ],
      breed: "Domestic Longhair",
      weight: "12 lbs",
      energyLevel: "Low",
      goodWith: ["Adults", "Older Children", "Cats"],
      medicalInfo: "Vaccinated, microchipped, neutered, on arthritis medication",
      specialNeeds: "No stairs, gentle handling"
    },
    {
      id: 2,
      name: "Luna",
      age: "Kitten",
      size: "Small",
      gender: "Female",
      timeAtShelter: "7 months",
      description: "Luna is a playful kitten who loves to chase toys and climb cat trees. She's been with us for 7 months.",
      longDescription: "Luna is a 9-month-old Domestic Shorthair who is full of energy and curiosity. She loves to play with toys, especially anything that moves or makes noise. Luna is very social and gets along well with other cats and people. She's litter-trained and learning to use scratching posts. Luna would be perfect for a family who can provide her with plenty of attention and playtime. She loves to climb and would enjoy a home with cat trees or shelves. Luna is very affectionate and loves to cuddle after a good play session.",
      photos: [
        "/api/placeholder/400/300/purple/9C27B0?text=Luna+1",
        "/api/placeholder/400/300/purple/BA68C8?text=Luna+2",
        "/api/placeholder/400/300/purple/E1BEE7?text=Luna+3"
      ],
      breed: "Domestic Shorthair",
      weight: "6 lbs",
      energyLevel: "High",
      goodWith: ["Children", "Cats", "Adults"],
      medicalInfo: "Vaccinated, microchipped, spayed, FIV/FeLV negative",
      specialNeeds: "Needs active playtime"
    },
    {
      id: 3,
      name: "Shadow",
      age: "Adult",
      size: "Large",
      gender: "Male",
      timeAtShelter: "5 months",
      description: "Shadow is a sleek black cat who loves to explore and hunt. He's been here for 5 months.",
      longDescription: "Shadow is a 3-year-old Domestic Shorthair who is very independent and curious. He loves to explore his environment and will investigate every nook and cranny. Shadow is a skilled hunter and enjoys chasing laser pointers and feather toys. He's very intelligent and can open doors and cabinets. Shadow is affectionate on his own terms and enjoys being petted when he's in the mood. He would do well in a home where he can have some independence and space to explore. Shadow gets along well with other cats but prefers to be the dominant one in the household.",
      photos: [
        "/api/placeholder/400/300/orange/FF5722?text=Shadow+1",
        "/api/placeholder/400/300/orange/FF7043?text=Shadow+2"
      ],
      breed: "Domestic Shorthair",
      weight: "15 lbs",
      energyLevel: "Medium",
      goodWith: ["Adults", "Cats"],
      medicalInfo: "Vaccinated, microchipped, neutered, FIV/FeLV negative",
      specialNeeds: "Needs space to explore"
    },
    {
      id: 4,
      name: "Mittens",
      age: "Kitten",
      size: "Small",
      gender: "Female",
      timeAtShelter: "4 months",
      description: "Mittens is an adorable kitten with white paws who loves to play and cuddle. She's been with us for 4 months.",
      longDescription: "Mittens is a 6-month-old Domestic Shorthair with distinctive white paws that look like little mittens. She's very playful and loves to chase toys and climb. Mittens is very affectionate and loves to sit in laps and be petted. She's litter-trained and learning to use scratching posts. Mittens gets along well with other cats and would be perfect for a family with children. She's very social and loves attention. Mittens would do well in a home where she can have plenty of playtime and cuddles.",
      photos: [
        "/api/placeholder/400/300/purple/AB47BC?text=Mittens+1",
        "/api/placeholder/400/300/purple/CE93D8?text=Mittens+2"
      ],
      breed: "Domestic Shorthair",
      weight: "5 lbs",
      energyLevel: "High",
      goodWith: ["Children", "Cats", "Adults"],
      medicalInfo: "Vaccinated, microchipped, spayed, FIV/FeLV negative",
      specialNeeds: "Needs playtime and attention"
    },
    {
      id: 5,
      name: "Tiger",
      age: "Adult",
      size: "Large",
      gender: "Male",
      timeAtShelter: "3 months",
      description: "Tiger is a handsome tabby who loves to lounge in sunny windows and chase laser pointers. He's been waiting for 3 months.",
      longDescription: "Tiger is a 4-year-old Domestic Shorthair with beautiful tabby markings. He's very laid-back and loves to spend time lounging in sunny windows. Tiger enjoys gentle play with laser pointers and feather toys. He's very affectionate and loves to be brushed and petted. Tiger is litter-trained and well-behaved. He gets along well with other cats and would be perfect for a calm household. Tiger is very loyal and will follow his favorite person around the house. He would do well in a home where he can have access to sunny spots and plenty of attention.",
      photos: [
        "/api/placeholder/400/300/orange/FF9800?text=Tiger+1",
        "/api/placeholder/400/300/orange/FFB74D?text=Tiger+2",
        "/api/placeholder/400/300/orange/FFCC02?text=Tiger+3"
      ],
      breed: "Domestic Shorthair",
      weight: "14 lbs",
      energyLevel: "Low",
      goodWith: ["Adults", "Older Children", "Cats"],
      medicalInfo: "Vaccinated, microchipped, neutered, FIV/FeLV negative",
      specialNeeds: "Loves sunny spots"
    },
    {
      id: 6,
      name: "Fluffy",
      age: "Adult",
      size: "Medium",
      gender: "Female",
      timeAtShelter: "2 months",
      description: "Fluffy is a beautiful long-haired cat who loves to be brushed and sit in laps. She's been here for 2 months.",
      longDescription: "Fluffy is a 5-year-old Domestic Longhair with gorgeous, silky fur. She loves to be brushed and groomed and will purr loudly during grooming sessions. Fluffy is very affectionate and loves to sit in laps and be petted. She's litter-trained and well-behaved. Fluffy gets along well with other cats and would be perfect for a calm household. She enjoys gentle play with toys and loves to chase laser pointers. Fluffy would do well in a home where she can have regular grooming and plenty of attention. She's very loyal and will make a wonderful companion.",
      photos: [
        "/api/placeholder/400/300/pink/E91E63?text=Fluffy+1",
        "/api/placeholder/400/300/pink/F48FB1?text=Fluffy+2"
      ],
      breed: "Domestic Longhair",
      weight: "10 lbs",
      energyLevel: "Low",
      goodWith: ["Adults", "Older Children", "Cats"],
      medicalInfo: "Vaccinated, microchipped, spayed, FIV/FeLV negative",
      specialNeeds: "Needs regular grooming"
    },
    {
      id: 7,
      name: "Smokey",
      age: "Senior",
      size: "Small",
      gender: "Male",
      timeAtShelter: "1 month",
      description: "Smokey is a gentle senior cat who enjoys quiet time and gentle pets. He's been with us for 1 month.",
      longDescription: "Smokey is a 13-year-old Domestic Shorthair who is looking for a peaceful retirement home. He's very gentle and loves to be petted and brushed. Smokey enjoys quiet time and spending time in sunny spots. He's litter-trained and well-behaved. Smokey gets along well with other cats and would be perfect for a quiet household. He has some arthritis in his joints, so he needs a home without stairs. Smokey is very loyal and will make a wonderful companion for someone who wants a calm, loving cat.",
      photos: [
        "/api/placeholder/400/300/gray/757575?text=Smokey+1",
        "/api/placeholder/400/300/gray/9E9E9E?text=Smokey+2"
      ],
      breed: "Domestic Shorthair",
      weight: "8 lbs",
      energyLevel: "Low",
      goodWith: ["Adults", "Older Children"],
      medicalInfo: "Vaccinated, microchipped, neutered, on arthritis medication",
      specialNeeds: "No stairs, gentle handling"
    },
    {
      id: 8,
      name: "Pepper",
      age: "Kitten",
      size: "Small",
      gender: "Female",
      timeAtShelter: "2 weeks",
      description: "Pepper is a spunky little kitten who loves to explore and play with other cats. She's been here for 2 weeks.",
      longDescription: "Pepper is a 4-month-old Domestic Shorthair who is full of energy and personality. She loves to explore and play with other cats. Pepper is very social and gets along well with everyone she meets. She's litter-trained and learning to use scratching posts. Pepper loves to chase toys and climb. She would be perfect for a family who can provide her with plenty of attention and playtime. Pepper is very affectionate and loves to cuddle after a good play session. She would do well in a home with other cats to play with.",
      photos: [
        "/api/placeholder/400/300/purple/8E24AA?text=Pepper+1",
        "/api/placeholder/400/300/purple/AB47BC?text=Pepper+2"
      ],
      breed: "Domestic Shorthair",
      weight: "4 lbs",
      energyLevel: "High",
      goodWith: ["Children", "Cats", "Adults"],
      medicalInfo: "Vaccinated, microchipped, spayed, FIV/FeLV negative",
      specialNeeds: "Needs active playtime and social interaction"
    }
  ];

  const openModal = (cat: Cat) => {
    setSelectedCat(cat);
    setCurrentPhotoIndex(0);
  };

  const closeModal = () => {
    setSelectedCat(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (selectedCat) {
      setCurrentPhotoIndex((prev) => 
        prev === selectedCat.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedCat) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? selectedCat.photos.length - 1 : prev - 1
      );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">
                Kenton County Animal Shelter
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/adoptable-pets"
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Adoptable Pets
              </a>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center">
                  Volunteer
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-orange-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a
                    href="/volunteer/new"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                  >
                    New Volunteer
                  </a>
                  <a
                    href="/volunteer/signin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                  >
                    Volunteer Sign In
                  </a>
                </div>
              </div>
              <a
                href="#"
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-orange-600 p-2"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Adoptable Cats
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our wonderful cats looking for their forever homes. They're sorted by time at the shelter, 
            with our longest residents first.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Cats</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age Filter */}
            <div>
              <label htmlFor="age-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <select
                id="age-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 text-gray-900"
              >
                <option value="">All Ages</option>
                <option value="kitten">Kitten</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label htmlFor="size-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                id="size-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 text-gray-900"
              >
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                Clear Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">8</span> of <span className="font-semibold">16</span> cats
              </p>
            </div>
          </div>
        </div>

        {/* Cats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <img 
                    src={cat.photos[0]} 
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {cat.timeAtShelter === "10 months" && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Longest Resident
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    cat.age === "Kitten" ? "bg-purple-100 text-purple-800" :
                    cat.age === "Adult" ? "bg-orange-100 text-orange-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>{cat.age}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    cat.size === "Small" ? "bg-green-100 text-green-800" :
                    cat.size === "Medium" ? "bg-green-100 text-green-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>{cat.size}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    cat.gender === "Male" ? "bg-green-100 text-green-800" : "bg-pink-100 text-pink-800"
                  }`}>{cat.gender}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">At shelter: {cat.timeAtShelter}</span>
                  <button 
                    onClick={() => openModal(cat)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Load More Cats
          </button>
        </div>

        {/* Back to All Pets */}
        <div className="text-center mt-8">
          <a
            href="/adoptable-pets"
            className="text-pink-600 hover:text-pink-500 font-medium transition-colors duration-200"
          >
            ← Back to All Pets
          </a>
        </div>
      </main>

      {/* Cat Details Modal */}
      {selectedCat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCat.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Photo Slideshow */}
              <div className="relative mb-6">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img
                    src={selectedCat.photos[currentPhotoIndex]}
                    alt={`${selectedCat.name} - Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                {/* Navigation Arrows */}
                {selectedCat.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Photo Indicators */}
                {selectedCat.photos.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedCat.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Cat Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breed:</span>
                      <span className="font-medium">{selectedCat.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedCat.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{selectedCat.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{selectedCat.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{selectedCat.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy Level:</span>
                      <span className="font-medium">{selectedCat.energyLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time at Shelter:</span>
                      <span className="font-medium">{selectedCat.timeAtShelter}</span>
                    </div>
                  </div>
                </div>

                {/* Compatibility */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Compatibility</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Good with:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedCat.goodWith.map((item, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Medical Information:</span>
                      <p className="text-sm mt-1">{selectedCat.medicalInfo}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Special Needs:</span>
                      <p className="text-sm mt-1">{selectedCat.specialNeeds}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">About {selectedCat.name}</h3>
                <p className="text-gray-700 leading-relaxed">{selectedCat.longDescription}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200">
                  Schedule a Visit
                </button>
                <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200">
                  Start Adoption Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 