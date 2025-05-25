import { Button, Card, CardContent, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'

import { blue } from '@mui/material/colors'
import { styled } from '@mui/material/styles'

// Styled component for a custom button
const CustomButton = styled(Button)(() => ({
  backgroundColor: 'transparent',
  border: 'solid 1px rgba(10, 107, 172, 0.92)',
  color: 'rgba(10, 107, 172, 0.92)',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: blue[50]
  }
}))

export { CustomButton }

const AskQuestion = () => {
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Card style={{ margin: lgAbove ? '24px' : null }}>
      <CardContent style={{ margin: '0px', padding: lgAbove ? '18px' : '14px', textAlign: 'justify' }}>
        <span style={{ color: '#444477' }}>
          <strong>Start asking to get answers</strong>
        </span>
        <br />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span>Find the answer to your question by asking.</span>
        </div>

        <CustomButton variant='contained' href='/post/add'>
          Ask question
        </CustomButton>
      </CardContent>
    </Card>
  )
}

export default AskQuestion
