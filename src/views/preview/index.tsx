'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import { useSelector } from 'react-redux'

import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'

type ReportedWeeklyDataType = {
  id: number
  filename: string
  url: string
  uploadedAt: string
  department: DepartmentDataType
  originName: string
}

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

const ReportPreview = () => {
  const reportedWeeklyList = useSelector((state: any) => state.reportWeekly.reportedWeekly) as ReportedWeeklyDataType[]

  // Handle Print Button Click
  const handleButtonClick = () => {
    window.print()
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 9 }}>
        <PreviewCard reportData={reportedWeeklyList} />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <PreviewActions onButtonClick={handleButtonClick} />
      </Grid>
    </Grid>
  )
}

export default ReportPreview
