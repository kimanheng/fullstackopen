import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    borderColor: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    color: '#34d399',
    borderRadius: 8,
    marginBottom: 15,
    fontWeight: 500
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
