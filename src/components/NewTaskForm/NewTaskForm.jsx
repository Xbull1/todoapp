import './NewTaskForm.css'
import { Component } from 'react'

export default class NewTaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
    }
  }

  shiftSubmit = (arg) => {
    this.setState({ inputValue: arg.target.value })
  }

  submit = (arg) => {
    arg.preventDefault()
    const { inputValue } = this.state
    const { addTask } = this.props
    if (inputValue.length > 0) {
      addTask({ description: inputValue })
      this.setState({ inputValue: '' })
    }
  }

  render() {
    const { inputValue } = this.state
    return (
      <form onSubmit={this.submit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onChange={this.shiftSubmit}
          value={inputValue}
        />
      </form>
    )
  }
}

NewTaskForm.defaultProps = {
  addTask: () => {},
}
