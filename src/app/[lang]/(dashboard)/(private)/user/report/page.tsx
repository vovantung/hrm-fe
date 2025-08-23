// 'use client'

// import WeeklyReportView from '@/views/user/report/WeeklyReport'

// // import { useParams } from 'next/navigation'

// const WeeklyReportPage = () => {
//   // const { id } = useParams()

//   return <WeeklyReportView />
// }

// export default WeeklyReportPage

// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import { Card } from '@mui/material'

import ReportSettings from '@/views/user/report'

const DepartmentReportTab = dynamic(() => import('@/views/user/report/DepartmentReportWeek'))

const SummaryReportTab = dynamic(() => import('@/views/user/report/SummaryReportWeek'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  department: <DepartmentReportTab />,
  summary: <SummaryReportTab />
})

const ReportSettingsPage = () => {
  return (
    <Card>
      <ReportSettings tabContentList={tabContentList()} />
    </Card>
  )
}

export default ReportSettingsPage
