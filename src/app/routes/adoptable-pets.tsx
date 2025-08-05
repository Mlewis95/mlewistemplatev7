import type { Route } from "./+types/adoptable-pets";
import { useEffect, useState } from "react";
import { getPets } from "../../lib/database";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adoptable Pets - Kenton County Animal Shelter" },
    { name: "description", content: "Browse our adoptable dogs and cats looking for their forever homes." },
  ];
}

export default function AdoptablePets() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        const petsData = await getPets();
        setPets(petsData);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, []);

  const dogs = pets.filter(pet => pet.type === 'dog');
  const cats = pets.filter(pet => pet.type === 'cat');
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
                className="text-orange-600 px-3 py-2 text-sm font-medium border-b-2 border-orange-600"
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

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Adoptable Pets
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our wonderful pets looking for their forever homes. Each one has a unique personality 
            and is ready to bring love and joy to your family.
          </p>
        </div>

        {/* Pet Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Dogs Card */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
              <svg className="w-32 h-32 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Dogs</h2>
              <p className="text-gray-600 mb-6">
                Our dogs are full of love and energy! From playful puppies to gentle seniors, 
                we have dogs of all ages, sizes, and personalities waiting to meet you.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {loading ? 'Loading...' : `${dogs.length} dogs available`}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Vaccinated and microchipped
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Spayed/neutered
                </div>
              </div>
              <a
                href="/adoptable-pets/dogs"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 inline-block text-center"
              >
                Browse Dogs
              </a>
            </div>
          </div>

          {/* Cats Card */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-32 h-32 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Cats</h2>
              <p className="text-gray-600 mb-6">
                Our cats are independent, loving companions! From curious kittens to wise seniors, 
                each cat has a unique personality and is ready to become part of your family.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {loading ? 'Loading...' : `${cats.length} cats available`}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Vaccinated and microchipped
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Spayed/neutered
                </div>
              </div>
              <a
                href="/adoptable-pets/cats"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 inline-block text-center"
              >
                Browse Cats
              </a>
            </div>
          </div>
        </div>

        {/* Adoption Process Info */}
        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Adoption Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Browse</h3>
              <p className="text-sm text-gray-600">View our available pets and find your perfect match</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Meet</h3>
              <p className="text-sm text-gray-600">Schedule a visit to meet your potential companion</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Apply</h3>
              <p className="text-sm text-gray-600">Complete our adoption application and interview</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Adopt</h3>
              <p className="text-sm text-gray-600">Take your new family member home!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 