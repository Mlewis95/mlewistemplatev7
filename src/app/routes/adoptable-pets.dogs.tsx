import type { Route } from "./+types/adoptable-pets.dogs";
import { useState, useEffect } from "react";
import { getPets } from "../../lib/database";

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
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  useEffect(() => {
    async function fetchDogs() {
      try {
        setLoading(true);
        const petsData = await getPets('dog');
        // Transform database data to match our interface
        const transformedDogs: Dog[] = petsData.map((pet: any) => ({
          id: pet.id,
          name: pet.name,
          age: pet.age,
          size: pet.size,
          gender: pet.gender,
          timeAtShelter: pet.time_at_shelter,
          description: pet.description,
          longDescription: pet.long_description,
          photos: pet.photos || [],
          breed: pet.breed,
          weight: pet.weight,
          energyLevel: pet.energy_level,
          goodWith: pet.good_with || [],
          medicalInfo: pet.medical_info,
          specialNeeds: pet.special_needs
        }));
        setDogs(transformedDogs);
      } catch (err) {
        console.error('Error fetching dogs:', err);
        setError('Failed to load dogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchDogs();
  }, []);

  // Filter dogs based on selected filters
  const filteredDogs = dogs.filter(dog => {
    if (ageFilter && dog.age.toLowerCase() !== ageFilter.toLowerCase()) return false;
    if (sizeFilter && dog.size.toLowerCase() !== sizeFilter.toLowerCase()) return false;
    return true;
  });

  const clearFilters = () => {
    setAgeFilter('');
    setSizeFilter('');
  };

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
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading dogs...</p>
          </div>
        )}

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
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
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
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
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
              <button 
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredDogs.length}</span> of <span className="font-semibold">{dogs.length}</span> dogs
              </p>
            </div>
          </div>
        </div>

        {/* Dogs Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDogs.map((dog) => (
            <div key={dog.id} className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                  <img 
                    src={dog.photos[0]} 
                    alt={dog.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {dogs.length > 0 && dog.timeAtShelter === dogs[0].timeAtShelter && (
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
        )}

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