'use client'

import { useParams } from 'next/navigation'

import PostPageReview1 from '@views/post/PostPageReview1'

const Post = () => {
  const { id } = useParams()

  return (
    <>
      <PostPageReview1 id={id} />
    </>
  )
}

export default Post
