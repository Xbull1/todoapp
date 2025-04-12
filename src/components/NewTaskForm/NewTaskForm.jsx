import './NewTaskForm.css'
import { useState } from 'react'

function NewTaskForm({ addTask }) {
  const [inputValue, setInputValue] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')

  const submit = (arg) => {
    arg.preventDefault()
    const isMinutesValid = minutes === '' || /^[0-9]*$/.test(minutes)
    const isSecondsValid = seconds === '' || /^[0-9]*$/.test(seconds)
    if (inputValue.length > 0 && isMinutesValid && isSecondsValid) {
      const minutesNum = parseInt(minutes, 10) || 0
      const secondsNum = parseInt(seconds, 10) || 0
      const duration = minutesNum * 60 + secondsNum
      addTask({ description: inputValue, duration })
      setInputValue('')
      setMinutes('')
      setSeconds('')
    }
  }
  return (
    <form className="new-todo-form" onSubmit={submit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      />
      <input
        type="text"
        placeholder="min"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        className="new-todo-form__timer"
      />
      <input
        type="text"
        placeholder="sec"
        value={seconds}
        onChange={(e) => setSeconds(e.target.value)}
        className="new-todo-form__timer"
      />
      <button type="submit" />
    </form>
  )
}

export default NewTaskForm
