import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification === null) {
    return null
  }

  const className = notification.type === 'error' 
    ? 'notification notification-error' 
    : 'notification notification-success'

  return (
    <div className={className}>
      {notification.text}
    </div>
  )
}

export default Notification
