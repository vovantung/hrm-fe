'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import { styled } from '@mui/material/styles'

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

// Component Imports
// import CustomTabList from '@core/components/mui/TabList'
import CustomTabList from '@mui/lab/TabList'

const ReportAdmin = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('report')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <CustomTabList
        TabIndicatorProps={{ sx: { height: 2, transition: 'none' } }}
        onChange={handleChange}
        aria-label='Report'
      >
        <CustomTab
          style={{
            marginLeft: '24px'
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
              backgroundColor: '#e0e0e776'
            },

            '&.Mui-selected': {
              backgroundColor: '#c4c4cc81'
            }
          }}
        />
        <CustomTab
          style={{}}
          label='Report review'
          icon={<i className='fluent-mdl2-report-lock' />}
          iconPosition='start'
          value='reportReview'
          sx={{
            '& .MuiTab-wrapper': {
              transition: 'none' // ngăn nhảy layout
            },
            '&:hover': {
              backgroundColor: '#e0e0e776'
            },

            '&.Mui-selected': {
              backgroundColor: '#c4c4cc81'
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
  )
}

export default ReportAdmin
