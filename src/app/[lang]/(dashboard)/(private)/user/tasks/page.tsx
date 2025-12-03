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

import TaskTabs from '@/views/user/tasks'

const TaskView = dynamic(() => import('@/views/user/tasks/Task'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  task: <TaskView />
})

const TaskPage = () => {
  return (
    <Card style={{ borderRadius: 2 }}>
      <TaskTabs tabContentList={tabContentList()} />
    </Card>
  )
}

export default TaskPage
