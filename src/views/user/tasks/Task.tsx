'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

import type { IconButtonProps, SlideProps } from '@mui/material'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Portal,
  Slide,
  Snackbar,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  MenuItem
} from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'

import tableStyles from '@core/styles/table.module.css'
import { useSettings } from '@/@core/hooks/useSettings'
import CustomTextField from '@/@core/components/mui/TextField'
import { setWorkflows } from '@/redux-store/slices/workflows'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: '#a30a12ff',
  position: 'absolute',
  boxShadow: theme.shadows[3],
  transform: 'translate(-2px, 2px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(-3px, 3px)',
    color: '#e6252fff'
  }
}))

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

type WorkflowDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
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
  assigneeId: number
  workflowId: number
  createBy: AccountDataType
  currentLevel: number
  totalStep: number
  vaitro: string
}
type TaskDataType_ = {
  title: string
  description: string
  workflowId: number
}

type TransitionProps = Omit<SlideProps, 'direction'>

const TransitionUp = (props: TransitionProps) => {
  return <Slide {...props} direction='down' />
}

const TaskView = () => {
  const { settings } = useSettings()
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const route = useRouter()

  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType
  const workflows = useSelector((state: any) => state.workflows.workflows) as WorkflowDataType[]
  const dispatch = useDispatch()

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  const [taskDTOs, setTaskDTOs] = useState<TaskDataType[]>()

  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  // const route = useRouter()

  const [init, setInit] = useState<boolean>(false)
  const [container, setContainer] = useState<Element | null>(null)

  // Data temp using for create account
  const [createTask, setCreateTask] = useState<TaskDataType_>({
    title: '',
    description: '',
    workflowId: 0
  })

  // Dailog add new account
  const [createTaskDailog, setCreateTaskDailog] = useState<boolean>(false)
  const toggleCreateTaskDailog = () => setCreateTaskDailog(!createTaskDailog)

  const closeCreateTaskDailog = () => {
    toggleCreateTaskDailog()
  }

  // Dữ liệu, cài đặt hông báo...
  const [transition, setTransition] = useState<ComponentType<TransitionProps>>()
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [message, setMessage] = useState<string>()

  const handleAlertOpen = (message: string) => {
    setTransition(() => TransitionUp)
    setMessage(message)
    setOpenAlert(true)
  }

  const handleAlertClose = (event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

  // Alert error
  const [openError, setOpenError] = useState<boolean>(false)

  const handleErrorOpen = (message: string) => {
    setTransition(() => TransitionUp)
    setMessage(message)
    setOpenError(true)
  }

  const handleErrorClose = (event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError(false)
  }

  async function refresh() {
    window.location.reload()
  }

  async function onChangeWorkflowToCreate(e: any) {
    try {
      setCreateTask({ ...createTask, workflowId: e.target.value })
    } catch (error) {
      window.location.href = '/pages/misc/500-server-error'
    }
  }

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

      const res = await fetch(globalVariables.url_report + '/user/task/get-related', param)

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

  async function initWorkflows() {
    //  Load Departments
    const param1 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth.token
      },
      body: JSON.stringify({
        limit: 100,
        keyOffset: 1,
        keySearch: ''
      })
    }

    const res1 = await fetch(globalVariables.url_report + '/user/workflows', param1)

    if (!res1.ok) {
      if (res1.status == 401) {
        refresh()

        return
      } else {
        const resError = await res1.json()

        handleErrorOpen('Can not get list department, because ' + resError.errorMessage)

        return
      }
    }

    const workflows = await res1.json()

    if (workflows !== undefined) {
      dispatch(setWorkflows(workflows))
    }
  }

  function handleViewAddTask() {
    setCreateTask({
      title: '',
      description: '',
      workflowId: 0
    })

    toggleCreateTaskDailog()
  }

  async function handleAddTask() {
    try {
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          title: createTask.title,
          description: createTask.description,
          workflowId: createTask.workflowId
        })
      }

      const res = await fetch(globalVariables.url_report + '/user/task/add', param)

      if (!res.ok) {
        if (res.status == 401) {
          refresh()

          return
        } else {
          const resError = await res.json()

          handleErrorOpen('Error, ' + resError.errorMessage)

          return
        }
      }

      handleAlertOpen('Đã thêm Task')
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

      const res = await fetch(globalVariables.url_report + '/user/task/submit-task', param)

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

      const res = await fetch(globalVariables.url_report + '/user/task/approve-task', param)

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
    // Load portal
    setContainer(document.getElementById('toast-root'))

    if (!init) {
      setInit(true)

      // Nạp danh sách accounts, roles, department lần đâu khi load trang

      // if (accounts.length == 0) {
      //   handleTask()
      // }
      handleTask()
      initWorkflows()
    }

    handleTask()
  }, [])

  if (taskDTOs)
    return (
      <div
        style={{
          height:
            settings.layout == 'horizontal'
              ? !lgAbove
                ? 'calc(100vh - 220)'
                : 'calc(100vh - 273px)'
              : !lgAbove
                ? 'calc(100vh - 217px)'
                : 'calc(100vh - 233px)',
          minHeight: '114px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            maxHeight:
              settings.layout == 'horizontal'
                ? !lgAbove
                  ? 'calc(100vh - 310px)'
                  : 'calc(100vh - 366px)'
                : lgAbove
                  ? 'calc(100vh - 326px)'
                  : 'calc(100vh - 310px)',
            minHeight: settings.layout == 'horizontal' ? '23px' : '23px',
            overflowY: 'auto',

            marginBottom: '20px',
            height:
              settings.layout == 'horizontal'
                ? !lgAbove
                  ? 'calc(100vh - 310px)'
                  : 'calc(100vh - 366px)'
                : lgAbove
                  ? 'calc(100vh - 326px)'
                  : 'calc(100vh - 310px)'
          }}
        >
          {' '}
          <TableContainer>
            <h3
              style={{
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '20px',
                marginTop: '00px',
                fontSize: lgAbove ? '17.5px' : '12px'
              }}
            >
              DÒNG CÔNG VIỆC
            </h3>
            <Table className={tableStyles.table} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                  >
                    <b>No</b>
                  </TableCell>
                  <TableCell style={{ fontSize: lgAbove ? '13.5px' : '11.5px' }}>
                    <b>Task name</b>
                  </TableCell>
                  <TableCell style={{ fontSize: lgAbove ? '13.5px' : '11.5px' }}>
                    <b>Description</b>
                  </TableCell>
                  <TableCell
                    style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                  >
                    <b>Step</b>
                  </TableCell>

                  <TableCell
                    style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                  >
                    <b>Asigneer Id</b>
                  </TableCell>

                  <TableCell
                    style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                  >
                    <b>Status</b>
                  </TableCell>
                  <TableCell
                    style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                  >
                    <b>Workflow</b>
                  </TableCell>
                  <TableCell
                    style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                  >
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskDTOs.map((taskDTO, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        alignContent: 'center',
                        textAlign: 'center',
                        fontSize: lgAbove ? '13.5px' : '11.5px'
                      }}
                    >
                      {index + 1 < 10 ? '0' + (index + 1) : index + 1}
                    </TableCell>
                    <TableCell style={{ fontSize: lgAbove ? '13.5px' : '11.5px' }}>{taskDTO.title} </TableCell>
                    <TableCell style={{ fontSize: lgAbove ? '13.5px' : '11.5px' }}>{taskDTO.description}</TableCell>
                    <TableCell
                      style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                    >
                      {taskDTO.currentLevel}/{taskDTO.totalStep}
                    </TableCell>

                    <TableCell
                      style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                    >
                      {taskDTO.assigneeId}
                    </TableCell>
                    <TableCell
                      style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                    >
                      {taskDTO.status}
                    </TableCell>
                    <TableCell
                      style={{ alignContent: 'center', textAlign: 'center', fontSize: lgAbove ? '13.5px' : '11.5px' }}
                    >
                      {taskDTO.workflowId}
                    </TableCell>

                    <TableCell
                      style={{
                        alignContent: 'center',
                        textAlign: 'center',
                        fontSize: lgAbove ? '13.5px' : '11.5px'
                      }}
                    >
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
                            size='small'
                            variant='contained'
                            onClick={approveTask}
                          >
                            Approve task
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <hr
          style={{
            border: 'none',
            borderTop: '0.6px solid #cccccc97',
            marginTop: '0px'
          }}
        />

        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
            marginLeft: '25px',

            // marginTop: settings.layout == 'horizontal' ? '16px' : '14px',
            marginRight: '20px'
          }}
        >
          <div
            style={{
              // color: theme.palette.primary.main,

              margin: '0px',
              padding: '0px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  fontSize: lgAbove ? '14px' : '13px'
                }}
                startIcon={<i style={{ height: '20px' }} className='icon-park-outline-upload-logs' />}
                color='primary'
                size='medium'
                variant='contained'
                onClick={handleViewAddTask}
              >
                Thêm Task
              </Button>
            </div>
          </div>

          <Box
            sx={{
              height: '70px'
            }}
          ></Box>

          <div
            style={{
              margin: '0px',
              padding: '0px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              {/* <Pagination
                    shape='rounded'
                    color='primary'
                    pageSize={6}
                    items={reportedWeeklyList}
                    onChangePage={onChangePage}
                  /> */}
            </div>
          </div>
        </Box>
        {container && (
          <Portal container={container}>
            {/* Alert */}
            <Snackbar
              open={openAlert}
              onClose={handleAlertClose}
              autoHideDuration={2500}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              TransitionComponent={transition}
              sx={{ zIndex: 9999 }}
            >
              <Alert
                variant='filled'
                severity='info'
                style={{ color: 'white', backgroundColor: '#056abdff' }}
                onClose={handleAlertClose}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.548)' // 👈 shadow
                }}
              >
                {message}
              </Alert>
            </Snackbar>

            {/* Error */}
            <Snackbar
              open={openError}
              onClose={handleErrorClose}
              autoHideDuration={2500}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              TransitionComponent={transition}
              sx={{ zIndex: 9999 }}
            >
              <Alert
                variant='filled'
                severity='error'
                style={{ color: 'white', backgroundColor: '#c51111a9' }}
                onClose={handleErrorClose}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.548)' // 👈 shadow
                  // borderRadius: 2 // bo góc mềm hơn (optional)
                }}
              >
                {message}
              </Alert>
            </Snackbar>
          </Portal>
        )}
        <Dialog
          fullWidth
          open={createTaskDailog}
          onClose={toggleCreateTaskDailog}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent>
            <CustomCloseButton onClick={closeCreateTaskDailog}>
              <Icon icon='pajamas:close-xs' fontSize='1.25rem' />
            </CustomCloseButton>
            <Typography variant='h4' sx={{ marginBottom: '5px' }}>
              Account
            </Typography>

            <Box sx={{ overflow: 'auto' }}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Title'
                placeholder='Enter a title'
                value={createTask.title ?? ''}
                onChange={e => setCreateTask({ ...createTask, title: e.target.value })}
                error={createTask.title === ''}
                helperText={createTask.title === '' ? 'This field is required.' : ''}
              />

              <CustomTextField
                style={{ marginTop: '15px' }}
                autoFocus
                fullWidth
                label='Description'
                placeholder='Enter description'
                value={createTask.description ?? ''}
                onChange={e => setCreateTask({ ...createTask, description: e.target.value })}
              />
              {/* <CustomTextField
                style={{ marginTop: '15px' }}
                autoFocus
                fullWidth
                label=''
                placeholder=''
                value={createTask.workflowId ?? 0}
                onChange={e => setCreateTask({ ...createTask, workflowId: e.target.value })}
              /> */}

              <CustomTextField
                style={{ marginTop: '15px' }}
                select
                fullWidth
                label='Department'
                onChange={onChangeWorkflowToCreate}
                value={createTask.workflowId}
              >
                {workflows.map(workflow => (
                  <MenuItem key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Box>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Button
                style={{ fontSize: '14px', borderRadius: 4 }}
                variant='contained'
                startIcon={<i className='material-symbols-person-add-rounded' />}
                sx={{ mr: 3.5 }}
                color='primary'
                onClick={handleAddTask}
              >
                Thêm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
}

export default TaskView
