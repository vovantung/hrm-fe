import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'

const SidebarAccount1 = () => {
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <div style={{ margin: '0px', marginTop: '0px' }}>
      <div
        style={{
          margin: '0px',
          padding: lgAbove ? '18px' : '14px',
          textAlign: 'justify',
          paddingTop: '0px',
          paddingBottom: '0px'
        }}
      >
        <span style={{ color: '#444477' }}>
          <strong>Sidebar 1</strong>
        </span>
        <br />
        <div style={{ marginTop: '0px', marginBottom: '20px' }}>
          <span>This is sidebar right for account page...</span>
        </div>
      </div>
    </div>
  )
}

export default SidebarAccount1
