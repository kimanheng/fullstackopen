import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: [],
  reducers: {
    setUsersList(state, action) {
      return action.payload
    }
  }
})

export const { setUsersList } = usersListSlice.actions

export const initializeUsersList = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch(setUsersList(users))
  }
}

export default usersListSlice.reducer
