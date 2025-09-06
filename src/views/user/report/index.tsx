'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
// import CustomTabList from '@core/components/mui/TabList'
import CustomTabList from '@mui/lab/TabList'

// import { useTheme } from '@mui/material'

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

    // color: '#fff',
    fontWeight: 400
  },

  // tắt ripple
  '& .MuiTouchRipple-root': {
    display: 'none'
  }
}))

const ReportSettings = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  const theme = useTheme()

  // States
  const [activeTab, setActiveTab] = useState('department')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <CustomTabList onChange={handleChange} aria-label='Report'>
        <CustomTab
          label='Department report'
          icon={<i className='fluent-mdl2-report-warning' />}
          iconPosition='start'
          value='department'
          style={{
            // marginLeft: '24px',
            fontWeight: 'bold'
          }}
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
          label='Summary report'
          icon={<i className='fluent-mdl2-report-lock' />}
          iconPosition='start'
          value='summary'
          style={{
            // marginLeft: '24px',
            fontWeight: 'bold'
          }}
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
  )
}

export default ReportSettings
