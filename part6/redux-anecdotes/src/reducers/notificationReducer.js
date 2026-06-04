import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationText(state, action) {
      return action.payload
    },
    clearNotificationText(state, action) {
      return null
    }
  }
})

export const { setNotificationText, clearNotificationText } = notificationSlice.actions

let timeoutId = null

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(setNotificationText(message))
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotificationText())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
