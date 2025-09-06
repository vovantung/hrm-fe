'use client'

import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// import { Card } from '@mui/material'

import { Card } from '@mui/material'

import ReportAdmin from '@/views/admin/report'

// import { useParams } from 'next/navigation'

const WeeklyReportViewTab = dynamic(() => import('@/views/admin/report/WeeklyReport'))

const PreviewCardTab = dynamic(() => import('@/views/admin/report/preview/PreviewCard'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  report: <WeeklyReportViewTab />,
  reportReview: <PreviewCardTab />
})

const WeeklyReportPage = () => {
  return (
    <Card style={{ borderRadius: 2 }}>
      <ReportAdmin tabContentList={tabContentList()} />
    </Card>
  )
}

export default WeeklyReportPage
