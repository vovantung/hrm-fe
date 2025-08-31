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

const ReportAdmin = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('report')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <CustomTabList onChange={handleChange} aria-label='Report'>
        <Tab
          style={{ marginTop: '10px' }}
          label='Report'
          icon={<i className='fluent-mdl2-report-warning' />}
          iconPosition='start'
          value='report'
        />
        <Tab
          style={{ marginTop: '10px' }}
          label='Report review'
          icon={<i className='fluent-mdl2-report-lock' />}
          iconPosition='start'
          value='reportReview'
        />
      </CustomTabList>
      <TabPanel value={activeTab}>{tabContentList[activeTab]}</TabPanel>
    </TabContext>
  )
}

export default ReportAdmin
