'use client'

import { useParams } from 'next/navigation'

import PostPageReview from '@views/post/PostPageReview'

const PostPage = () => {
  const { id } = useParams()

  return (
    <>
      <PostPageReview id={id} />
    </>
  )
}

export default PostPage
