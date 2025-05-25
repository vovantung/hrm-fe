import { useTheme } from '@emotion/react'
import { Card, CardContent, useMediaQuery } from '@mui/material'

const QuestionTag = () => {
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Card style={{ margin: lgAbove ? '24px' : null, marginTop: lgAbove ? null : '14px' }}>
      <CardContent style={{ margin: '0px', padding: lgAbove ? '18px' : '14px', textAlign: 'justify' }}>
        <span style={{ color: '#444477' }}>
          <strong>Explore related questions</strong>
        </span>
        <br />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span> See similar questions with these tags.</span>
        </div>

        {/* <Button variant='contained' color='secondary'>
          Ask question
        </Button> */}
      </CardContent>
    </Card>
  )
}

export default QuestionTag
