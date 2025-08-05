import type { Route } from "./+types/volunteer.signin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Volunteer Sign In - Kenton County Animal Shelter" },
    { name: "description", content: "Sign in to your volunteer account at Kenton County Animal Shelter." },
  ];
}

export default function VolunteerSignIn() {
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
                <button className="text-orange-600 px-3 py-2 text-sm font-medium border-b-2 border-orange-600 flex items-center">
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
                    className="block px-4 py-2 text-sm text-orange-600 bg-orange-50"
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Volunteer Portal
            </h1>
            <p className="text-gray-600">
              Sign in to your existing account or create a new volunteer login.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sign In Form */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                                     <input
                     type="email"
                     id="signin-email"
                     name="signin-email"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                     placeholder="Enter your email"
                   />
                </div>

                <div>
                  <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                                     <input
                     type="password"
                     id="signin-password"
                     name="signin-password"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                     placeholder="Enter your password"
                   />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-orange-600 hover:text-orange-500 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                                         <input
                       type="text"
                       id="first-name"
                       name="first-name"
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                       placeholder="First name"
                     />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                                         <input
                       type="text"
                       id="last-name"
                       name="last-name"
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                       placeholder="Last name"
                     />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                                     <input
                     type="email"
                     id="register-email"
                     name="register-email"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                     placeholder="Enter your email"
                   />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                                     <input
                     type="tel"
                     id="phone"
                     name="phone"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                     placeholder="(555) 123-4567"
                   />
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                                     <input
                     type="password"
                     id="register-password"
                     name="register-password"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                     placeholder="Create a password"
                   />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                                     <input
                     type="password"
                     id="confirm-password"
                     name="confirm-password"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                     placeholder="Confirm your password"
                   />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-orange-600 hover:text-orange-500">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-600 hover:text-orange-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p>
                  <strong>Forgot your password?</strong> Click the "Forgot password?" link above to reset it.
                </p>
              </div>
              <div>
                <p>
                  <strong>New volunteer?</strong> After creating an account, sign up for orientation on our{" "}
                  <a href="/volunteer/new" className="text-orange-600 hover:text-orange-500">
                    new volunteer page
                  </a>.
                </p>
              </div>
              <div>
                <p>
                  <strong>Technical issues?</strong> Contact our support team at{" "}
                  <a href="mailto:volunteer@kentoncountyshelter.org" className="text-orange-600 hover:text-orange-500">
                    volunteer@kentoncountyshelter.org
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 