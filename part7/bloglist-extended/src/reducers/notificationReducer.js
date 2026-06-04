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

export const setNotification = (text, type = 'success', seconds = 5) => {
  return dispatch => {
    dispatch(setNotificationText({ text, type }))
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotificationText())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
