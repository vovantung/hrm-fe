// import Router from 'next/router'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'
import { Card, CardContent, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'

const RelatedPost1 = () => {
  // const [articles, setArticles] = useState([])
  // const store = useSelector(state => state.custom)
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  // useEffect(() => {
  //   loadItems()
  // }, [articles])

  // async function loadItems() {
  //   // if (id == undefined || id == '' || id == null) {
  //   //   return null
  //   // }

  //   if (articles.length > 0) {
  //     return
  //   }

  //   try {
  //     // Lấy danh sách các article
  //     const r1 = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //     const response1 = await fetch(store.url + '/post/get-all-post', r1)
  //     const result = await response1.json()
  //     if (result !== undefined) {
  //       setArticles(result)
  //     }
  //   } catch (exception) {
  //     Router.replace('/pages/misc/500-server-error')
  //   }
  // }

  return (
    <Card style={{ margin: lgAbove ? '24px' : null }}>
      <CardContent style={{ margin: '0px', padding: lgAbove ? '18px' : '14px', textAlign: 'justify' }}>
        <span style={{ color: '#444477' }}>
          <strong>Related posts</strong>
        </span>
        {/* <div style={{}}>
          {articles.map(article => (
            <div key={article.id} style={{ marginTop: '10px' }}>
              <span
                onClick={() => Router.push('/post/' + article.id)}
                style={{ cursor: 'pointer', color: '#505080', textDecoration: 'none', fontSize: '14px' }}
              >
                {article.title}
              </span>
            </div>
          ))}
        </div> */}
      </CardContent>
    </Card>
  )
}

export default RelatedPost1
