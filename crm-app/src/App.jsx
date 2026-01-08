import { Routes, Route, Navigate } from 'react-router-dom'

import Signup from './auth/Signup'
import Login from './auth/Login'
import Dashboard from './dashboard/Dashboard'
import CustomerList from './customers/CustomerList'
import AddCustomer from './customers/AddCustomer'
import FollowUps from './followups/FollowUps'

import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />

      {/* Public */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerList />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddCustomer />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/followups"
        element={
          <ProtectedRoute>
            <Layout>
              <FollowUps />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  )
}
