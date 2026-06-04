import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUserState(state, action) {
      return action.payload
    },
    clearUserState(state, action) {
      return null
    }
  }
})

export const { setUserState, clearUserState } = userSlice.actions

export const loadUserFromLocalStorage = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUserState(user))
    }
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUserState(user))
      dispatch(setNotification(`Welcome back, ${user.name || user.username}!`, 'success'))
    } catch (error) {
      dispatch(setNotification('Wrong username or password', 'error'))
      throw error
    }
  }
}

export const logoutUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUserState())
    dispatch(setNotification('Logged out successfully', 'success'))
  }
}

export default userSlice.reducer
