import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'

export const AppPage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/signin')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect even if logout fails
      navigate('/signin')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">My App</h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="danger"
                onClick={handleLogout}
                loading={isLoggingOut}
                disabled={isLoggingOut}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome to the application.
              </h2>

              {user && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    User Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Email: </span>
                      <span className="text-sm font-medium text-gray-900">
                        {user.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">User ID: </span>
                      <span className="text-sm font-medium text-gray-900">
                        {user.id}
                      </span>
                    </div>
                    {user.name && (
                      <div>
                        <span className="text-sm text-gray-600">Name: </span>
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">
                        Member since:{' '}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  This is a protected page that requires authentication. You can
                  only see this content because you are logged in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
