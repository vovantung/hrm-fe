'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import { styled, useTheme } from '@mui/material/styles'

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 400,
  lineHeight: 1.25,
  padding: '8px 16px',
  minHeight: 40,
  minWidth: 120,
  letterSpacing: 0,
  transition: 'none',

  // ẩn pseudo element nếu MUI thêm ::after / ::before
  '&::before, &::after': {
    display: 'none',
    content: 'none'
  },

  // chỉ đổi màu label khi hover (đổi trên wrapper là chắc chắn)
  '&:hover .MuiTab-wrapper': {
    color: theme.palette.error.main
  },

  // Không đổi fontWeight / padding on hover
  '&:hover': {
    padding: '8px 16px',
    fontWeight: 400,
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },

  // selected state: nền xanh (ví dụ) nhưng KHÔNG thay đổi kích thước
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    fontWeight: 400
  },

  // tắt ripple
  '& .MuiTouchRipple-root': {
    display: 'none'
  }
}))

// Component Imports
// import CustomTabList from '@core/components/mui/TabList'
import CustomTabList from '@mui/lab/TabList'
import { Box } from '@mui/material'

const ReportAdmin = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('report')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const theme = useTheme()

  return (
    <Box display='flex' flexDirection='column' height='100%'>
      <Box flex='1'>
        {' '}
        <TabContext value={activeTab}>
          <CustomTabList
            onChange={handleChange}
            aria-label='Report'

            // TabIndicatorProps={{
            //   sx: {
            //     backgroundColor: theme.palette.primary.dark
            //   }
            // }}
          >
            <CustomTab
              style={{
                // marginLeft: '24px',
                fontWeight: 'bold'
              }}
              label='Report'
              icon={<i className='fluent-mdl2-report-warning' />}
              iconPosition='start'
              value='report'
              sx={{
                '& .MuiTab-wrapper': {
                  transition: 'none' // ngăn nhảy layout
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.lighterOpacity
                },

                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.mainOpacity,
                  fontWeight: 'bold'
                }
              }}
            />
            <CustomTab
              style={{
                fontWeight: 'bold'
              }}
              label='Report review'
              icon={<i className='fluent-mdl2-report-lock' />}
              iconPosition='start'
              value='reportReview'
              sx={{
                '& .MuiTab-wrapper': {
                  transition: 'none' // ngăn nhảy layout
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.lighterOpacity
                },

                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.mainOpacity,
                  fontWeight: 'bold'
                }
              }}
            />

            {/* Tab này để tạo padding cho các tab và không cho component nào */}
            <CustomTab
              style={{
                paddingTop: '15px',
                paddingBottom: '15px',
                marginLeft: '24px',
                visibility: 'hidden'
              }}
              label='hidden'
            />
          </CustomTabList>
          <TabPanel value={activeTab}>{tabContentList[activeTab]}</TabPanel>
        </TabContext>
      </Box>
      {/* <Box flex='2' sx={{ height: '70px' }}>
        <div style={{ height: '70px', backgroundColor: 'wheat' }}>
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
                color: theme.palette.primary.main,
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
                    borderRadius: 4
                  }}
                  startIcon={<i style={{ height: '20px' }} className='ph-printer-bold' />}
                  color='primary'
                  size='medium'
                  variant='contained'
                >
                  In thống kê
                </Button>
              </div>
            </div>

            <div style={{ backgroundColor: 'blue', height: '70px' }}></div>
            <div
              style={{
                color: theme.palette.primary.main,
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
                    borderRadius: 4
                  }}
                  startIcon={<i style={{ height: '20px' }} className='ph-printer-bold' />}
                  color='primary'
                  size='small'
                  variant='contained'
                >
                  In thống kê
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </Box> */}
    </Box>
  )
}

export default ReportAdmin
