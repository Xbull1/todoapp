import { Component } from 'react'
import './Task.css'
import { formatDistanceToNow } from 'date-fns'

export default class Task extends Component {
  static formatDate(date) {
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
  }

  static formatRemainingTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  constructor(props) {
    super(props)
    const { task } = props
    this.state = {
      isEdit: false,
      newDescription: task.description,
      displayTime: task.remainingTime,
      isRunning: !!task.timerStartTime,
    }
    this.intervalId = null
  }

  componentDidMount() {
    const { isRunning } = this.state
    if (isRunning) {
      this.startTimer()
    }
  }

  componentDidUpdate(prevProps) {
    const { task: prevTask } = prevProps
    const { task } = this.props

    if (prevTask.remainingTime !== task.remainingTime) {
      this.setState({ displayTime: task.remainingTime })
    }

    if (prevTask.timerStartTime && !task.timerStartTime) {
      this.stopTimer(false)
    }
  }

  componentWillUnmount() {
    this.stopTimer(false)
  }

  startTimer = () => {
    const { isRunning } = this.state
    if (isRunning) return

    const { task, updateTaskTimer } = this.props
    const now = Date.now()

    updateTaskTimer(task.id, task.remainingTime, now)

    this.setState({ isRunning: true })
    this.intervalId = setInterval(this.updateDisplayTime, 1000)
  }

  stopTimer = (shouldUpdateParent) => {
    const { isRunning } = this.state
    if (!isRunning) return

    clearInterval(this.intervalId)
    this.intervalId = null

    const { task, updateTaskTimer } = this.props
    const { displayTime } = this.state

    if (shouldUpdateParent) {
      updateTaskTimer(task.id, displayTime, null)
    }

    this.setState({ isRunning: false })
  }

  updateDisplayTime = () => {
    const { task } = this.props
    if (!task.timerStartTime) return

    const now = Date.now()
    const elapsedSeconds = Math.floor((now - task.timerStartTime) / 1000)
    const newDisplayTime = Math.max(0, task.remainingTime - elapsedSeconds)

    this.setState({ displayTime: newDisplayTime })

    if (newDisplayTime <= 0) {
      this.stopTimer(true)
    }
  }

  handleTimerClick = () => {
    const { isRunning } = this.state
    const { task } = this.props

    if (task.completed) return

    if (isRunning) {
      this.stopTimer(true)
    } else {
      this.startTimer()
    }
  }

  idEditing = () => {
    this.setState((prevState) => ({ isEdit: !prevState.isEdit }))
  }

  updDescription = (event) => {
    this.setState({ newDescription: event.target.value })
  }

  descriptionSave = (event) => {
    event.preventDefault()
    const { newDescription } = this.state
    const { task, descriptionChange } = this.props

    if (newDescription.trim() === '') return

    descriptionChange(task.id, newDescription)
    this.idEditing()
  }

  render() {
    const { task, removeTask, toggleTaskCompletion } = this.props
    const { isEdit, newDescription, displayTime, isRunning } = this.state
    const { completed, id, created, description } = task

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
              <button type="button" className={icon} onClick={this.handleTimerClick} disabled={completed} />
              {Task.formatRemainingTime(displayTime)}
            </span>
            <span className="created">{Task.formatDate(createdDate)}</span>
          </label>
          <button className="icon icon-edit" type="button" onClick={this.idEditing} />
          <button className="icon icon-destroy" type="button" onClick={removeTask} />
        </div>
        {isEdit && (
          <form onSubmit={this.descriptionSave}>
            <input
              id={`edit-${id}`}
              className="edit"
              type="text"
              value={newDescription}
              onChange={this.updDescription}
            />
          </form>
        )}
      </li>
    )
  }
}

Task.defaultProps = {
  task: {
    id: 0,
    description: '',
    completed: false,
    created: Date.now(),
    remainingTime: 0,
    timerStartTime: null,
  },
  removeTask: () => {},
  toggleTaskCompletion: () => {},
  descriptionChange: () => {},
  updateTaskTimer: () => {},
}
