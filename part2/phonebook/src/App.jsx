import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filter, setFilter }) => {
  return (
    <div className="filter-section">
      <label>filter shown with </label>
      <input 
        type="text"
        value={filter} 
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  )
}

const PersonForm = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber, setMessage }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
        window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) 
        && personService.update(
          persons.find(person => person.name.toLowerCase() === newName.toLowerCase()).id,
          { name: newName, number: newNumber }
        ).then(response => {
          setPersons(persons.map(person => person.id !== response.data.id ? person : response.data))
          setMessage(`Updated ${newName}'s number`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`Information of ${newName} has already been updated from server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      } else {
        personService.create({
          name: newName,
          number: newNumber
        })
        .then(response => {
          setPersons(persons.concat(response.data))
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`Failed to add ${newName}: ${error.message}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      }
      setNewName('')
      setNewNumber('')
    }}>
      <div className="form-group">
        <label>name: </label>
        <input 
          type="text"
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>number: </label>
        <input 
          type="text"
          value={newNumber} 
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, setPersons, setMessage }) => {
  const handleDelete = (id) => {
    window.confirm(`Delete ${persons.find(p => p.id === id).name}?`) && personService.remove(id)
      .then(() => {
        const deletedPerson = persons.find(p => p.id === id)
        setPersons(persons.filter(person => person.id !== id))
        setMessage(`Deleted ${deletedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage(`Failed to delete ${persons.find(p => p.id === id).name}: ${error.message}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  return (
    <div className="persons-list">
      {persons.map(person => (
        <div key={person.id} className="person-item">
          <div className="person-info">
            {person.name} <span className="person-number">{person.number}</span>
          </div>
          <button 
            className="delete-btn" 
            onClick={() => handleDelete(person.id)}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  )
}

const Notification = ({ message }) => {
  if (!message) return null

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])  

  return (
    <div className="app-container">
      <h2>Phonebook</h2>
      <Notification message={message} />

      <Filter filter={filter} setFilter={setFilter} />

      <h3>add a new</h3>

      <PersonForm 
        persons={persons}
        setPersons={setPersons}
        newName={newName} 
        setNewName={setNewName}
        newNumber={newNumber} 
        setNewNumber={setNewNumber}
        setMessage={setMessage}
      />

      <h2>Numbers</h2>
      
      <Persons 
        persons={persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))} 
        setPersons={setPersons}
        setMessage={setMessage}
      />
    </div>
  )
}                                                                                                                 

export default App