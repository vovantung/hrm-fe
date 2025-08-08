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
          Authorization: localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
          unsignedTitle: id
        })
      }

      const response = await fetch('https://backend.txuapp.com/hrm/test', r)

      const result = await response.json()

      if (result !== undefined) {
        // alert(result.test)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  return <>Hello</>
}

export default PostPageReview1
