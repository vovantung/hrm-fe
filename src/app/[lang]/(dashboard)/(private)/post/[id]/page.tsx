'use client'

import { useParams } from 'next/navigation'

import PostPageReview from '@views/post/PostPageReview'

const Post = () => {
  const { id } = useParams()

  return (
    <>
      <PostPageReview id={id} />
    </>
  )
}

export default Post
