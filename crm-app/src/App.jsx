import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './auth/Login'
import Signup from './auth/Signup'
import Dashboard from './dashboard/Dashboard'
import CustomerList from './customers/CustomerList'
import AddCustomer from './customers/AddCustomer'
import FollowUps from './followups/FollowUps'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customers" element={<CustomerList />} />
      <Route path="/customers/add" element={<AddCustomer />} />
      <Route path="/followups" element={<FollowUps />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
