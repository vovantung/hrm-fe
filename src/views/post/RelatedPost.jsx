'use client'
import { useEffect, useState } from 'react'

// import { Router } from 'next/router'

import Link from 'next/link'

// import { useRouter } from 'next/navigation'

import { Card, CardContent, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { useSelector } from 'react-redux'

const RelatedPost = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  // const store = useSelector(state => state.custom)
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const store = useSelector(state => state.customReducer)

  // const router = useRouter()

  useEffect(() => {
    // gọi API 1 lần khi component mount
    const fetchUser = async () => {
      try {
        // Lấy danh sách các article
        const r1 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization')
          }
        }

        const response1 = await fetch(store.url + '/post/get-all-post', r1)

        const result = await response1.json()

        if (result !== undefined) {
          setArticles(result)
        }
      } catch (exception) {
        // router.replace('/pages/misc/500-server-error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return null // hoặc <Skeleton />

  return (
    <>
      <Card style={{ margin: lgAbove ? '24px' : null, marginTop: lgAbove ? null : '14px' }}>
        <CardContent style={{ margin: '0px', padding: lgAbove ? '18px' : '14px', textAlign: 'justify' }}>
          <span style={{ color: '#444477' }}>
            <strong>Related posts</strong>
          </span>
          <div style={{}}>
            {articles.map(article => (
              <div key={article.id} style={{ marginTop: '10px' }}>
                {/* <span style={{ cursor: 'pointer', color: '#004080', textDecoration: 'none', fontSize: '14px' }}>
                <Link href={'/en/post/' + article.unsignedTitle}>{article.title}</Link>
              </span> */}

                <Link
                  href={`/en/post/${article.unsignedTitle}`}
                  style={{
                    cursor: 'pointer',
                    color: '#004080',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  {article.title}
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default RelatedPost
