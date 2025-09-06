// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import menuItemStyles from '@/@core/styles/vertical/menuItemStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* Author: Vo Van Tung; 25/7/2025 */}
        <SubMenu label={dictionary['navigation'].txuAdmin} icon={<i className='eos-icons-admin-outlined' />}>
          <MenuItem href={`/${locale}/admin/account`} icon={<i className='ic-round-supervisor-account' />}>
            {dictionary['navigation'].txuAccount}
          </MenuItem>
          <MenuItem href={`/${locale}/admin/department`} icon={<i className='flowbite-users-group-solid' />}>
            {dictionary['navigation'].txuDepartment}
          </MenuItem>
          <MenuItem href={`/${locale}/admin/report`} icon={<i className='fluent-mdl2-report-lock' />}>
            {dictionary['navigation'].txuSummaryReport}
          </MenuItem>
        </SubMenu>

        <SubMenu label={dictionary['navigation'].txuUser} icon={<i className='heroicons-user-solid' />}>
          <MenuItem href={`/${locale}/user/report`} icon={<i className='fluent-mdl2-report-warning' />}>
            {dictionary['navigation'].txuReport}
          </MenuItem>
        </SubMenu>

        <MenuSection label={dictionary['navigation'].appsPages}>
          <SubMenu label={dictionary['navigation'].academy} icon={<i className='tabler-school' />}>
            <MenuItem href={`/${locale}/apps/academy/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/my-courses`}>{dictionary['navigation'].myCourses}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/course-details`}>
              {dictionary['navigation'].courseDetails}
            </MenuItem>
          </SubMenu>
          {/*
          <SubMenu label={dictionary['navigation'].invoice} icon={<i className='tabler-file-description' />}>
            <MenuItem
              href={`/${locale}/apps/invoice/preview/4987`}
              exactMatch={false}
              activeUrl='/apps/invoice/preview'
            >
              {dictionary['navigation'].preview}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/invoice/edit/4987`} exactMatch={false} activeUrl='/apps/invoice/edit'>
              {dictionary['navigation'].edit}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/invoice/add`}>{dictionary['navigation'].add}</MenuItem>
          </SubMenu> */}
          {/* <SubMenu
            label={dictionary['navigation'].dashboards}
            icon={<i className='tabler-smart-home' />}
            suffix={<CustomChip label='5' size='small' color='error' round='true' />}
          >
            <MenuItem href={`/${locale}/dashboards/academy`}>{dictionary['navigation'].academy}</MenuItem>
          </SubMenu> */}
          <SubMenu label={dictionary['navigation'].frontPages} icon={<i className='tabler-files' />}>
            <MenuItem href='/front-pages/landing-page' target='_blank'>
              {dictionary['navigation'].landing}
            </MenuItem>
            <MenuItem href='/front-pages/pricing' target='_blank'>
              {dictionary['navigation'].pricing}
            </MenuItem>
            <MenuItem href='/front-pages/payment' target='_blank'>
              {dictionary['navigation'].payment}
            </MenuItem>
          </SubMenu>
        </MenuSection>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
