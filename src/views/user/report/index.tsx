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

const ReportSettings = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('department')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <CustomTabList onChange={handleChange} aria-label='Report'>
        <Tab
          style={{ marginTop: '10px' }}
          label='Department report'
          icon={<i className='fluent-mdl2-report-warning' />}
          iconPosition='start'
          value='department'
        />
        <Tab
          style={{ marginTop: '10px' }}
          label='Summary report'
          icon={<i className='fluent-mdl2-report-lock' />}
          iconPosition='start'
          value='summary'
        />
      </CustomTabList>
      <TabPanel value={activeTab}>{tabContentList[activeTab]}</TabPanel>
    </TabContext>
  )
}

export default ReportSettings
