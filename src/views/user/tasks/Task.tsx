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

// type WorkflowType = {
//   id: number
//   name: string
//   description: string
//   type: string
// }

type TaskDataType = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  deadline: string
  createdAt: string
  updateAt: string
  assigneeId: number
  workflowId: number
  createBy: AccountDataType
  currentLevel: number
  vaitro: string
}

const TaskView = () => {
  const route = useRouter()

  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  const [taskDTOs, setTaskDTOs] = useState<TaskDataType[]>()

  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  async function handleTask() {
    try {
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({})
      }

      const res = await fetch(globalVariables.url_user + '/task/get-related', param)

      if (!res.ok) {
        return
      }

      const taskDTOs = await res.json()

      if (taskDTOs !== undefined) {
        setTaskDTOs(taskDTOs)
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
    handleTask()
  }, [])

  if (taskDTOs)
    return (
      <>
        {taskDTOs?.length > 0 ? (
          taskDTOs.map((taskDTO, index) => (
            <div key={index}>
              Tast name: {taskDTO.title}
              <br></br>
              Description: {taskDTO.description}
              <br></br>
              Status {taskDTO.status}
              <br></br>
              workflowId: {taskDTO.workflowId}
              {taskDTO.vaitro == '0' ? (
                <div>
                  <Button
                    id={taskDTO.id + '_'}
                    style={{
                      borderRadius: 4
                    }}
                    disabled={taskDTO.assigneeId == userLogined.id ? false : true}
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
                    id={taskDTO.id + '_'}
                    style={{
                      borderRadius: 4
                    }}
                    disabled={taskDTO.assigneeId == userLogined.id ? false : true}
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
          ))
        ) : (
          <div>Không có task cần xử lý</div>
        )}
      </>
    )
}

export default TaskView
