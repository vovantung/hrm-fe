import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface User {
  id: string
  username: string
}

interface Post {
  id: string
  title: string
  unsignedTitle: string
  content: string
  account: User
  commentList: []
}

// interface UserState {
//   posts: Record<string, Post>
// }

// const initialState: UserState = {
//   posts: {}
// }

// const postSlice = createSlice({
//   name: 'post',
//   initialState,
//   reducers: {
//     setPost(state, action: PayloadAction<Post>) {
//       const post = action.payload

//       state.posts[post.unsignedTitle] = post
//     }
//   }
// })

interface PostState {
  lastPost: Post | null
}

const initialState: PostState = {
  lastPost: null
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLastPost(state, action: PayloadAction<Post>) {
      state.lastPost = action.payload
    },
    clearLastPost(state) {
      state.lastPost = null
    }
  }
})

export const { setLastPost, clearLastPost } = postSlice.actions
export default postSlice.reducer
