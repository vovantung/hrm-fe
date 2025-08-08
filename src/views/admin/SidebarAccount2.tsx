import { Card, CardContent, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'

const SidebarAccount2 = () => {
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Card style={{ margin: '24px', marginTop: '0px' }}>
      <CardContent style={{ margin: '0px', padding: lgAbove ? '18px' : '14px', textAlign: 'justify' }}>
        <span style={{ color: '#444477' }}>
          <strong>Sidebar 2</strong>
        </span>
        <br />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span>This is sidebar right for account page...</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default SidebarAccount2
