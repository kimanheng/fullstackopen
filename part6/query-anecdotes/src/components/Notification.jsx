import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const value = useNotificationValue()
  
  if (!value) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e11d48',
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
    color: '#fb7185',
    borderRadius: 8,
    marginBottom: 15,
    fontWeight: 500
  }

  // Detect if it is a success message or warning based on keywords
  const isSuccess = !value.toLowerCase().includes('short') && !value.toLowerCase().includes('error') && !value.toLowerCase().includes('fail')
  if (isSuccess) {
    style.borderColor = '#34d399'
    style.backgroundColor = 'rgba(52, 211, 153, 0.1)'
    style.color = '#34d399'
  }

  return (
    <div style={style}>
      {value}
    </div>
  )
}

export default Notification
