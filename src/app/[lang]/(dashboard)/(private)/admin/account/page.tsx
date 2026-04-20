'use client'

import { Card } from '@mui/material'

import AccountPage from '@/views/admin/account/AccountPage'

// import { useParams } from 'next/navigation'

const AdminPage = () => {
  // const { id } = useParams()

  return (
    <Card style={{ borderRadius: 4 }}>
      <AccountPage />
    </Card>
  )
}

export default AdminPage
