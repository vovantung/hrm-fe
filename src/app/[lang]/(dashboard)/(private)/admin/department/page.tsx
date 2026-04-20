'use client'

import { Card } from '@mui/material'

import DepartmentPage from '@/views/admin/department/Department'

const AdminPage = () => {
  return (
    <Card style={{ borderRadius: 4 }}>
      <DepartmentPage />
    </Card>
  )
}

export default AdminPage
