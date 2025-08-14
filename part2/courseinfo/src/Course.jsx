const Course = ({ course }) => {
  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map(parts => (
          <div key={parts.id}>{parts.name} {parts.exercises}</div>
        ))}
      <p>total of {course.parts.reduce((sum, parts) => sum + parts.exercises, 0)} exercises</p>
    </div>
  )
}

export default Course