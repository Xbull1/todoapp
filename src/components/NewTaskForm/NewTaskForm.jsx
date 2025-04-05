import './NewTaskForm.css'
import { Component } from 'react'

export default class NewTaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      minutes: '',
      seconds: '',
    }
  }

  shiftSubmit = (arg) => {
    this.setState({ inputValue: arg.target.value })
  }

  shiftMinutes = (arg) => {
    this.setState({ minutes: arg.target.value })
  }

  shiftSeconds = (arg) => {
    this.setState({ seconds: arg.target.value })
  }

  submit = (arg) => {
    arg.preventDefault()
    const { inputValue, minutes, seconds } = this.state
    const { addTask } = this.props
    const isMinutesValid = minutes === '' || /^[0-9]*$/.test(minutes)
    const isSecondsValid = seconds === '' || /^[0-9]*$/.test(seconds)
    if (inputValue.length > 0 && isMinutesValid && isSecondsValid) {
      const minutesNum = parseInt(minutes, 10) || 0
      const secondsNum = parseInt(seconds, 10) || 0
      const duration = minutesNum * 60 + secondsNum
      addTask({ description: inputValue, duration })
      this.setState({ inputValue: '', minutes: '', seconds: '' })
    }
  }

  render() {
    const { inputValue, minutes, seconds } = this.state
    return (
      <form className="new-todo-form" onSubmit={this.submit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onChange={this.shiftSubmit}
          value={inputValue}
        />
        <input
          type="text"
          placeholder="min"
          value={minutes}
          onChange={this.shiftMinutes}
          className="new-todo-form__timer"
        />
        <input
          type="text"
          placeholder="sec"
          value={seconds}
          onChange={this.shiftSeconds}
          className="new-todo-form__timer"
        />
        <button type="submit" />
      </form>
    )
  }
}

NewTaskForm.defaultProps = {
  addTask: () => {},
}
