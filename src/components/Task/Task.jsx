import { useState, useEffect, useRef } from 'react'
import './Task.css'
import { formatDistanceToNow } from 'date-fns'

function Task({ task, removeTask, toggleTaskCompletion, descriptionChange, updateTaskTimer }) {
  const { completed, id, created, description } = task
  const [isEdit, setIsEdit] = useState(false)
  const [newDescription, setNewDescription] = useState(task.description)
  const [displayTime, setDisplayTime] = useState(task.remainingTime)
  const [isRunning, setIsRunning] = useState(!!task.timerStartTime)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(task.timerStartTime)
  const remainingTimeRef = useRef(task.remainingTime)

  useEffect(() => {
    startTimeRef.current = task.timerStartTime
    remainingTimeRef.current = task.remainingTime
  }, [task.timerStartTime, task.remainingTime])

  const formatDate = (date) => {
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
  }

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }
  const stopTimer = (shouldUpdateParent) => {
    if (!isRunning) return

    clearInterval(intervalRef.current)
    intervalRef.current = null

    if (shouldUpdateParent) {
      updateTaskTimer(id, displayTime, null)
    }
    setIsRunning(false)
  }

  const updateDisplayTime = () => {
    if (!startTimeRef.current) return

    const now = Date.now()
    const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000)
    const newDisplayTime = Math.max(0, remainingTimeRef.current - elapsedSeconds)

    setDisplayTime(newDisplayTime)

    if (newDisplayTime <= 0) {
      stopTimer(true)
    }
  }

  const startTimer = () => {
    if (isRunning) return

    const now = Date.now()
    updateTaskTimer(id, remainingTimeRef.current, now)
    setIsRunning(true)
    startTimeRef.current = now
    intervalRef.current = setInterval(updateDisplayTime, 1000)
  }

  const handleTimerClick = () => {
    if (completed) return
    if (isRunning) {
      stopTimer(true)
    } else {
      startTimer()
    }
  }

  useEffect(() => {
    if (isRunning) {
      startTimer()
    } else {
      stopTimer(false)
    }

    return () => {
      stopTimer(false)
    }
  }, [isRunning])

  useEffect(() => {
    setDisplayTime(task.remainingTime)
    remainingTimeRef.current = task.remainingTime
  }, [task.remainingTime])

  useEffect(() => {
    if (task.timerStartTime && !isRunning) {
      setIsRunning(true)
    } else if (!task.timerStartTime && isRunning) {
      setIsRunning(false)
    }
  }, [task.timerStartTime])

  const idEditing = () => {
    setIsEdit((prev) => !prev)
  }

  const updDescription = (e) => {
    setNewDescription(e.target.value)
  }

  const descriptionSave = (e) => {
    e.preventDefault()
    if (newDescription.trim() === '') return
    descriptionChange(id, newDescription)
    idEditing()
  }

  let liClassName = ''
  if (completed) liClassName += 'completed'
  if (isEdit) liClassName += 'editing'

  const icon = `icon ${isRunning ? 'icon-pause' : 'icon-play'}`
  const createdDate = new Date(created)

  return (
    <li className={liClassName}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={completed} onChange={toggleTaskCompletion} />
        <label htmlFor={`edit-${id}`}>
          <span className="description">{description}</span>
          <span className="created created__timer">
            <button type="button" className={icon} onClick={handleTimerClick} disabled={completed} />
            {formatRemainingTime(displayTime)}
          </span>
          <span className="created">{formatDate(createdDate)}</span>
        </label>
        <button className="icon icon-edit" type="button" onClick={idEditing} />
        <button className="icon icon-destroy" type="button" onClick={removeTask} />
      </div>
      {isEdit && (
        <form onSubmit={descriptionSave}>
          <input id={`edit-${id}`} className="edit" type="text" value={newDescription} onChange={updDescription} />
        </form>
      )}
    </li>
  )
}

export default Task
