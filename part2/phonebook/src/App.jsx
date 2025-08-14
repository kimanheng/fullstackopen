import { useState } from 'react'

const Filter = ({ filter, setFilter }) => {
  return (
    <p>filter shown with <input value={filter} onChange={(event) => setFilter(event.target.value)} /></p>
  )
}

const PersonForm = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form onSubmit={(e) => {
          e.preventDefault()
          if (persons.some(person => person.name === newName)) {
            alert(newName + ' is already added to phonebook')
          } else {
            setPersons(persons.concat({ name: newName, number: newNumber, id: persons.length + 1 }))
          }
          setNewName('')
          setNewNumber('')
        }}>
      <div>
        name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>{person.name} {person.number}</div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>

      <PersonForm 
        person={persons}
        setPerson={setPersons}
        newName={newName} 
        setNewName={setNewName}
        newNumber={newNumber} 
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      
      <Persons 
        persons={persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))} 
      />
    </div>
  )
}

export default App