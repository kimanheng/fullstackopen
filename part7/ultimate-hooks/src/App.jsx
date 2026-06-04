import { useState, useEffect } from 'react'
import axios from 'axios'

// Custom field hook
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

// Custom ultimate resource manager hook (FSO Exercise 7.8)
const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
      .then(response => {
        setResources(response.data)
      })
      .catch(error => {
        console.error('Error fetching resource:', error.message)
      })
  }, [baseUrl])

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setResources(resources.concat(response.data))
    return response.data
  }

  const service = {
    create
  }

  return [
    resources,
    service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.reset()
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
    name.reset()
    number.reset()
  }

  const getInputProps = (fieldHook) => {
    const { reset, ...inputProps } = fieldHook
    return inputProps
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...getInputProps(content)} placeholder="new note..." required />
        <button type="submit">create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>Persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...getInputProps(name)} placeholder="name" required /> <br/>
        number <input {...getInputProps(number)} placeholder="number" required />
        <button type="submit" style={{ marginLeft: '10px' }}>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App
