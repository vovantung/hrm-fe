'use client'

import { useParams } from 'next/navigation'

import TaskDetailsView from '@/views/user/task-details/TaskDetails'

// Vars

const TaskPage = () => {
  const { id } = useParams()

  return (
    <>
      <TaskDetailsView id={id} />
    </>
  )
}

export default TaskPage
