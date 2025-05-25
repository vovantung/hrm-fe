import { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Box } from '@mui/material'

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

import { useDispatch, useSelector } from 'react-redux'

import EditorComment from './EditorComment'
import AskQuestion from './AskQuestion'
import QuestionTag from './QuestionTag'
import RelatedPost from './RelatedPost'
import { setLastPost } from '@/redux-store/slices/post'

const PostPageReview = ({ id }) => {
  const [commentList, setCommentList] = useState([])
  const contentRef = useRef(null)
  const commentRef = useRef(null)

  const store = useSelector(state => state.customReducer)
  const [initId, setInitId] = useState(null)

  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  const dispatch = useDispatch()

  // const cachedPost = useSelector(state => state.post.posts[id])
  // const [post, setPostState] = useState(cachedPost)

  const lastPost = useSelector(state => state.post.lastPost)

  const [post, setPostState] = useState(lastPost || null)

  const route = useRouter()

  useEffect(() => {
    // if (cachedPost) {
    //   setPostState(cachedPost)
    // }

    loadItems(id)

    if (commentList.length > 0) {
      highlightCodeComment()
    }

    highlightCodeContent()
  }, [id, post])

  async function loadItems(id) {
    if (id == undefined || id == '' || id == null || (initId != '' && initId == id)) {
      return
    }

    setPostState(lastPost || null) // Tạm gán dữ liệu cũ để hiển thị

    try {
      const r = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unsignedTitle: id
        })
      }

      const response = await fetch(store.url + '/post/get-post', r)
      const post = await response.json()

      if (post !== undefined) {
        if (JSON.stringify(commentList) !== JSON.stringify(post.commentList)) {
          setCommentList(post.commentList)
        }

        // dispatch(setPost(post))
        // setPostState(post)

        dispatch(setLastPost(post)) // Cập nhật redux với user mới
        setPostState(post)

        // setLoading(false)
      }

      setInitId(id)
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleCallback() {
    // try {
    //   const r = {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       postId: postId
    //     })
    //   }
    //   const response = await fetch(
    //     'https://a968-2402-800-6340-186f-1f6-209a-22cd-3ccd.ngrok-free.app' + '/comment/get-comments-of-post',
    //     r
    //   )
    //   const comments = await response.json()
    //   if (Array.isArray(comments) && comments.length > 0) {
    //     setCommentList(comments)
    //   } else {
    //     setCommentList([])
    //   }
    // } catch (exception) {
    //   Router.replace('/pages/misc/500-server-error')
    // }
  }

  const highlightCodeComment = () => {
    if (commentRef.current) {
      commentRef.current.querySelectorAll('pre code').forEach(block => {
        block.className = '' // Xóa toàn bộ class cũ
        block.classList.add(`language-java`) // Thêm ngôn ngữ mới
        hljs.highlightElement(block)
        block.classList.remove('language-java', 'hljs')
      })
    }
  }

  const highlightCodeContent = () => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll('pre code').forEach(block => {
        block.className = '' // Xóa toàn bộ class cũ
        block.classList.add(`language-java`) // Thêm ngôn ngữ mới
        hljs.highlightElement(block)
        block.classList.remove('language-java', 'hljs')
      })
    }
  }

  return (
    <>
      {post ? (
        <div style={{ margin: '0px', padding: '0px' }}>
          {post.title !== '' ? (
            <>
              <span style={{ fontSize: '20px', color: '#333' }}>
                <strong> {post.title}</strong>
              </span>
              <br />
            </>
          ) : null}

          {post.createdAt !== '' ? (
            <>
              <span style={{ fontSize: '12px', color: '#777' }}>Posted {post.createdAt}</span>
              <hr style={{ border: 'none', borderBottom: '1px solid #d1d1d1' }} />
            </>
          ) : null}

          <div ref={contentRef} sx={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: post.content }}></div>
          {post.createdAt !== '' ? (
            <div style={{ width: '100%', textAlign: 'right' }}>
              <div
                style={{
                  backgroundColor: ' #F9EBCA35',
                  display: 'inline-block',
                  borderRadius: '4px',
                  paddingLeft: '10px',
                  paddingRight: '10px'
                }}
              >
                <span style={{ fontSize: '12px', color: '#3087e0', display: 'inline-block' }}>
                  {post.account.username}
                </span>
                <span style={{ fontSize: '12px', color: '#555', textAlign: 'right' }}>, posted {post.createdAt}</span>
              </div>
            </div>
          ) : null}

          {lgAbove ? null : post.content === '' ? null : (
            <>
              <RelatedPost id={id}></RelatedPost>
            </>
          )}

          <div ref={commentRef} style={{ marginTop: '10px' }}>
            {post.commentList.length !== 0 ? (
              <>
                <span style={{ fontSize: '18px', marginTop: '16px' }}>
                  <strong>Answer</strong>{' '}
                </span>
                <hr style={{ border: 'none', borderTop: '1px solid #d1d1d1' }} />
              </>
            ) : null}

            {post.commentList.map(comment => (
              <div key={comment.id} style={{ marginTop: '10px' }}>
                <Box sx={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: comment.content }}></Box>
                <div style={{ width: '100%', textAlign: 'right' }}>
                  <div
                    style={{
                      backgroundColor: '#f8feff',
                      display: 'inline-block',
                      borderRadius: '4px',
                      paddingLeft: '10px',
                      paddingRight: '10px'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#4091e0', textAlign: 'right' }}>
                      {comment.account.username}
                    </span>
                    {/* <br /> */}
                    <span style={{ fontSize: '12px', color: '#555', textAlign: 'right' }}>
                      , asked {comment.createdAt}
                    </span>
                  </div>
                  {post.commentList.lastIndexOf(comment) ? null : (
                    <hr style={{ border: 'none', borderTop: '0.8px solid #ccc' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          {post.content !== '' ? (
            <>
              <span style={{ fontSize: '18px' }}>
                <strong>Your Answer</strong>{' '}
              </span>
              <EditorComment id={post.id} callback={handleCallback}></EditorComment>
            </>
          ) : null}

          {lgAbove ? null : post.content === '' ? null : (
            <>
              <AskQuestion></AskQuestion>
              <QuestionTag></QuestionTag>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default PostPageReview
