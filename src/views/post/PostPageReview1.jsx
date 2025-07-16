import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

const PostPageReview1 = ({ id }) => {
  const route = useRouter()

  useEffect(() => {
    loadItems(id)
  }, [id])

  async function loadItems(id) {
    if (id == undefined || id == '' || id == null) {
      return
    }

    try {
      const r = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2b3ZhbnR1bmciLCJpc3MiOiJ0eHUtaXNzIiwiZXhwIjoxNzUyNjcxNzk0LCJpYXQiOjE3NTI2NTM3OTR9.34TdfnZVT8VafIft-QWj3b_x5Yq-nECswIG6Pm3wjmE'
        },
        body: JSON.stringify({
          unsignedTitle: id
        })
      }

      const response = await fetch('https://backend.txuapp.com/test', r)

      const result = await response.json()

      if (result !== undefined) {
        // if (JSON.stringify(commentList) !== JSON.stringify(post.commentList)) {
        //   setCommentList(post.commentList)
        // }
        // alert(result.test)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  return <>Hello</>
}

export default PostPageReview1
