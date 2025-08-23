// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/user/settings'

const AccountTab = dynamic(() => import('@views/user/settings/account'))

// const SecurityTab = dynamic(() => import('@views/user/settings/security'))
// const BillingPlansTab = dynamic(() => import('@views/user/settings/billing-plans'))
// const NotificationsTab = dynamic(() => import('@views/user/settings/notifications'))
const ConnectionsTab = dynamic(() => import('@views/user/settings/connections'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />,

  // security: <SecurityTab />,
  // 'billing-plans': <BillingPlansTab />,
  // notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
