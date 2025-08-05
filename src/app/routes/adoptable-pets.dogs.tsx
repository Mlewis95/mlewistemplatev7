import type { Route } from "./+types/adoptable-pets.dogs";
import { useState } from "react";

interface Dog {
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
    { title: "Adoptable Dogs - Kenton County Animal Shelter" },
    { name: "description", content: "Browse our adoptable dogs looking for their forever homes. Filter by age and size." },
  ];
}

export default function AdoptableDogs() {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Sample dog data with photos
  const dogs: Dog[] = [
    {
      id: 1,
      name: "Buddy",
      age: "Adult",
      size: "Large",
      gender: "Male",
      timeAtShelter: "8 months",
      description: "Buddy is a gentle giant who loves belly rubs and long walks. He's been waiting for his forever home for 8 months.",
      longDescription: "Buddy is a 4-year-old Golden Retriever mix who came to us as a stray. Despite his size, he's incredibly gentle and patient. He loves children and gets along well with other dogs. Buddy is house-trained and knows basic commands like sit, stay, and come. He's a perfect family dog who enjoys playing fetch, going for walks, and cuddling on the couch. His favorite treats are peanut butter and carrots. Buddy would do best in a home with a fenced yard where he can run and play.",
      photos: [
        "/api/placeholder/400/300/orange/FF6B35?text=Buddy+1",
        "/api/placeholder/400/300/orange/FF8C42?text=Buddy+2", 
        "/api/placeholder/400/300/orange/FFA726?text=Buddy+3",
        "/api/placeholder/400/300/orange/FFB74D?text=Buddy+4"
      ],
      breed: "Golden Retriever Mix",
      weight: "65 lbs",
      energyLevel: "Medium",
      goodWith: ["Children", "Dogs", "Cats"],
      medicalInfo: "Vaccinated, microchipped, neutered, heartworm negative",
      specialNeeds: "None"
    },
    {
      id: 2,
      name: "Luna",
      age: "Puppy",
      size: "Medium",
      gender: "Female",
      timeAtShelter: "6 months",
      description: "Luna is an energetic puppy who loves to play fetch and cuddle. She's been with us for 6 months.",
      longDescription: "Luna is a 10-month-old Border Collie mix who is full of energy and intelligence. She's incredibly smart and learns new tricks quickly. Luna loves to play fetch, go for runs, and solve puzzle toys. She's very affectionate and loves to give kisses. Luna is crate-trained and working on her house-training. She would be perfect for an active family who can provide her with plenty of exercise and mental stimulation. Luna gets along well with other dogs and would love a canine companion to play with.",
      photos: [
        "/api/placeholder/400/300/purple/9C27B0?text=Luna+1",
        "/api/placeholder/400/300/purple/BA68C8?text=Luna+2",
        "/api/placeholder/400/300/purple/E1BEE7?text=Luna+3"
      ],
      breed: "Border Collie Mix",
      weight: "35 lbs",
      energyLevel: "High",
      goodWith: ["Children", "Dogs"],
      medicalInfo: "Vaccinated, microchipped, spayed, heartworm negative",
      specialNeeds: "Needs active lifestyle"
    },
    {
      id: 3,
      name: "Max",
      age: "Adult",
      size: "Small",
      gender: "Male",
      timeAtShelter: "4 months",
      description: "Max is a sweet little guy who loves to sit in laps and go for short walks. He's been here for 4 months.",
      longDescription: "Max is a 3-year-old Chihuahua mix who is the perfect lap dog. He's very affectionate and loves to cuddle. Max is house-trained and knows basic commands. He enjoys short walks and playing with small toys. Max is a bit shy at first but warms up quickly to people he trusts. He would do well in a quiet home with older children or adults. Max is not a fan of loud noises and would prefer a calm environment. He's great for apartment living due to his small size and low exercise needs.",
      photos: [
        "/api/placeholder/400/300/orange/FF9800?text=Max+1",
        "/api/placeholder/400/300/orange/FFB74D?text=Max+2"
      ],
      breed: "Chihuahua Mix",
      weight: "12 lbs",
      energyLevel: "Low",
      goodWith: ["Adults", "Older Children"],
      medicalInfo: "Vaccinated, microchipped, neutered, heartworm negative",
      specialNeeds: "Prefers quiet environment"
    },
    {
      id: 4,
      name: "Daisy",
      age: "Senior",
      size: "Small",
      gender: "Female",
      timeAtShelter: "3 months",
      description: "Daisy is a wise senior who enjoys quiet time and gentle pets. She's been with us for 3 months.",
      longDescription: "Daisy is a 12-year-old Shih Tzu who is looking for a peaceful retirement home. She's very gentle and loves to be brushed and pampered. Daisy is house-trained and well-behaved. She enjoys short walks and spending time in sunny spots. Daisy is great with older adults and would be perfect for a quiet household. She has some arthritis in her hips, so she needs a home without stairs. Daisy is very loyal and will make a wonderful companion for someone who wants a calm, loving dog.",
      photos: [
        "/api/placeholder/400/300/gray/9E9E9E?text=Daisy+1",
        "/api/placeholder/400/300/gray/BDBDBD?text=Daisy+2"
      ],
      breed: "Shih Tzu",
      weight: "15 lbs",
      energyLevel: "Low",
      goodWith: ["Adults", "Older Children"],
      medicalInfo: "Vaccinated, microchipped, spayed, on arthritis medication",
      specialNeeds: "No stairs, gentle exercise only"
    },
    {
      id: 5,
      name: "Rocky",
      age: "Adult",
      size: "Large",
      gender: "Male",
      timeAtShelter: "2 months",
      description: "Rocky is a strong, loyal dog who loves to run and play. He's been waiting for 2 months.",
      longDescription: "Rocky is a 5-year-old German Shepherd mix who is incredibly loyal and protective. He's very intelligent and eager to please. Rocky knows many commands and is well-trained. He loves to go for long walks, play fetch, and work on training exercises. Rocky is protective of his family and would make an excellent guard dog. He needs an experienced owner who can provide firm, consistent training. Rocky gets along well with other dogs but would prefer to be the only dog in the household. He's great with older children who know how to interact with dogs respectfully.",
      photos: [
        "/api/placeholder/400/300/orange/FF5722?text=Rocky+1",
        "/api/placeholder/400/300/orange/FF7043?text=Rocky+2",
        "/api/placeholder/400/300/orange/FF8A65?text=Rocky+3"
      ],
      breed: "German Shepherd Mix",
      weight: "75 lbs",
      energyLevel: "High",
      goodWith: ["Older Children", "Adults"],
      medicalInfo: "Vaccinated, microchipped, neutered, heartworm negative",
      specialNeeds: "Needs experienced owner"
    },
    {
      id: 6,
      name: "Bella",
      age: "Puppy",
      size: "Small",
      gender: "Female",
      timeAtShelter: "1 month",
      description: "Bella is an adorable puppy who loves to explore and make new friends. She's been here for 1 month.",
      longDescription: "Bella is a 6-month-old Beagle mix who is full of curiosity and energy. She loves to explore and follow her nose. Bella is very social and gets along well with everyone she meets. She's working on her house-training and basic commands. Bella loves to play with toys and other dogs. She would be perfect for a family who can provide her with plenty of attention and training. Bella is very food-motivated, which makes training easier. She would do well in a home with a fenced yard where she can safely explore.",
      photos: [
        "/api/placeholder/400/300/purple/AB47BC?text=Bella+1",
        "/api/placeholder/400/300/purple/CE93D8?text=Bella+2"
      ],
      breed: "Beagle Mix",
      weight: "20 lbs",
      energyLevel: "Medium",
      goodWith: ["Children", "Dogs", "Cats"],
      medicalInfo: "Vaccinated, microchipped, spayed, heartworm negative",
      specialNeeds: "Needs training and supervision"
    }
  ];

  const openModal = (dog: Dog) => {
    setSelectedDog(dog);
    setCurrentPhotoIndex(0);
  };

  const closeModal = () => {
    setSelectedDog(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (selectedDog) {
      setCurrentPhotoIndex((prev) => 
        prev === selectedDog.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedDog) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? selectedDog.photos.length - 1 : prev - 1
      );
    }
  };

  // Find dog by name for the cards
  const getDogByName = (name: string) => dogs.find(dog => dog.name === name);
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
            Adoptable Dogs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our wonderful dogs looking for their forever homes. They're sorted by time at the shelter, 
            with our longest residents first.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Dogs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age Filter */}
            <div>
              <label htmlFor="age-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <select
                id="age-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900"
              >
                <option value="">All Ages</option>
                <option value="puppy">Puppy</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900"
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
                Showing <span className="font-semibold">12</span> of <span className="font-semibold">24</span> dogs
              </p>
            </div>
          </div>
        </div>

        {/* Dogs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <div key={dog.id} className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                  <img 
                    src={dog.photos[0]} 
                    alt={dog.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {dog.timeAtShelter === "8 months" && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Longest Resident
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{dog.name}</h3>
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    dog.age === "Puppy" ? "bg-purple-100 text-purple-800" :
                    dog.age === "Adult" ? "bg-orange-100 text-orange-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>{dog.age}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dog.size === "Small" ? "bg-green-100 text-green-800" :
                    dog.size === "Medium" ? "bg-blue-100 text-blue-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>{dog.size}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    dog.gender === "Male" ? "bg-green-100 text-green-800" : "bg-pink-100 text-pink-800"
                  }`}>{dog.gender}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {dog.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">At shelter: {dog.timeAtShelter}</span>
                  <button 
                    onClick={() => openModal(dog)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Load More Dogs
          </button>
        </div>

        {/* Back to All Pets */}
        <div className="text-center mt-8">
          <a
            href="/adoptable-pets"
            className="text-orange-600 hover:text-orange-500 font-medium transition-colors duration-200"
          >
            ← Back to All Pets
          </a>
        </div>
      </main>

      {/* Dog Details Modal */}
      {selectedDog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedDog.name}</h2>
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
                    src={selectedDog.photos[currentPhotoIndex]}
                    alt={`${selectedDog.name} - Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                {/* Navigation Arrows */}
                {selectedDog.photos.length > 1 && (
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
                {selectedDog.photos.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedDog.photos.map((_, index) => (
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

              {/* Dog Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breed:</span>
                      <span className="font-medium">{selectedDog.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedDog.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{selectedDog.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{selectedDog.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{selectedDog.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy Level:</span>
                      <span className="font-medium">{selectedDog.energyLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time at Shelter:</span>
                      <span className="font-medium">{selectedDog.timeAtShelter}</span>
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
                        {selectedDog.goodWith.map((item, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Medical Information:</span>
                      <p className="text-sm mt-1">{selectedDog.medicalInfo}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Special Needs:</span>
                      <p className="text-sm mt-1">{selectedDog.specialNeeds}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">About {selectedDog.name}</h3>
                <p className="text-gray-700 leading-relaxed">{selectedDog.longDescription}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200">
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