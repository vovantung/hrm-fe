'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useSelector } from 'react-redux'
import { Button } from '@mui/material'

type AccountDataType = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string

  // department: DepartmentDataType
  // role: RoleDataType
  newpassword: string
}

type WorkflowType = {
  id: number
  name: string
  description: string
  type: string
}

type TaskDataType = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  deadline: string
  createdAt: string
  updateAt: string
  assignee: AccountDataType
  createBy: AccountDataType
  currentLevel: number
  workflow: WorkflowType
}

const TaskDetailsView = ({ id }: any) => {
  const route = useRouter()

  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  const [task, setTask] = useState<{ task: TaskDataType; vaiTro: string }>()

  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  async function handleTask(id: any) {
    try {
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          taskId: id
        })
      }

      const res = await fetch(globalVariables.url_user + '/task/get-by-id', param)

      if (!res.ok) {
        return
      }

      const task = await res.json()

      if (task !== undefined) {
        setTask(task)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function submitTask(event: any) {
    // const taskId = event.target.id
    const taskId = event.target.id.substring(0, event.target.id.length - 1)

    try {
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          taskId: taskId
        })
      }

      const res = await fetch(globalVariables.url_user + '/task/submit-task', param)

      if (!res.ok) {
        alert('Submit task failed!')

        return
      }

      const tasks = await res.json()

      if (tasks == true) {
        alert(' Submit task success!')
      } else {
        alert('Submit task failed!')
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function approveTask(event: any) {
    // const taskId = event.target.id
    const taskId = event.target.id.substring(0, event.target.id.length - 1)

    try {
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          taskId: taskId
        })
      }

      const res = await fetch(globalVariables.url_user + '/task/approve-task', param)

      if (!res.ok) {
        alert('Approve task failed!')

        return
      }

      const tasks = await res.json()

      if (tasks == true) {
        alert('Approve task success!')
      } else {
        alert('Approve task failed!')
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  useEffect(() => {
    handleTask(id)
  }, [id])

  if (task)
    return (
      <>
        {task ? (
          <div>
            Tast name: {task.task.title}
            <br></br>
            Description: {task.task.description}
            <br></br>
            Status {task.task.status}
            <br></br>
            workflow: {task.task.workflow.name}
            <br></br>
            Workflow type: {task.task.workflow.type}
            {task.vaiTro == '0' ? (
              <div>
                <Button
                  id={task.task.id + '_'}
                  style={{
                    borderRadius: 4
                  }}
                  disabled={task.task.assignee?.id == userLogined.id ? false : true}
                  startIcon={<i style={{ height: '20px' }} className='icon-park-outline-upload-logs' />}
                  color='primary'
                  size='medium'
                  variant='contained'
                  onClick={submitTask}
                >
                  Submit task
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  id={task.task.id + '_'}
                  style={{
                    borderRadius: 4
                  }}
                  disabled={task.task.assignee?.id == userLogined.id ? false : true}
                  startIcon={<i style={{ height: '20px' }} className='icon-park-outline-upload-logs' />}
                  color='primary'
                  size='medium'
                  variant='contained'
                  onClick={approveTask}
                >
                  Approve task
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>Không có task cần xử lý</div>
        )}
      </>
    )
}

export default TaskDetailsView
