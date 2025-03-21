import { Component } from 'react'
import './Task.css'
import { formatDistanceToNow } from 'date-fns'

export default class Task extends Component {
  static formatDate(date) {
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
  }

  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      newDescription: props.task.description,
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
    if (newDescription.trim() === '') {
      return
    }
    descriptionChange(task.id, newDescription)
    this.idEditing()
  }

  render() {
    const { task, removeTask, toggleTaskCompletion } = this.props
    const { isEdit, newDescription } = this.state // Деструктурируем state
    let liClassName = ''
    if (task.completed) {
      liClassName += 'completed'
    } else if (isEdit) {
      liClassName += 'editing'
    }

    const createdDate = new Date(task.created)
    return (
      <li className={liClassName}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={task.completed} onChange={toggleTaskCompletion} />
          <label htmlFor={`edit-${task.id}`}>
            <span className="description">{task.description}</span>
            <span className="created">{Task.formatDate(createdDate)}</span>
          </label>
          <button className="icon icon-edit" type="button" onClick={this.idEditing} />
          <button className="icon icon-destroy" type="button" onClick={removeTask} />
        </div>
        {isEdit ? (
          <form onSubmit={this.descriptionSave}>
            <input
              id={`edit-${task.id}`}
              className="edit"
              type="text"
              value={newDescription}
              onChange={this.updDescription}
            />
          </form>
        ) : null}
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
  },
  removeTask: () => {},
  toggleTaskCompletion: () => {},
  descriptionChange: () => {},
}
