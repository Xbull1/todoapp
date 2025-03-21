import './App.css'
import { Component } from 'react'
import TaskList from './components/TaskList/TaskList'
import NewTaskForm from './components/NewTaskForm/NewTaskForm'
import Footer from './components/Footer/Footer'
import TasksFilter from './components/TasksFilter/TasksFilter'
import Header from './components/Header/Header'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      filter: 'all',
    }
  }

  addTask = (task) => {
    const newTask = { ...task, id: Date.now(), completed: false, created: Date.now() }
    if (task.description.trim() !== '') {
      this.setState((prevState) => ({
        tasks: [...prevState.tasks, newTask],
      }))
    }
  }

  removeTask = (index) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.toSpliced(index, 1),
    }))
  }

  toggleTaskCompletion = (index) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task)),
    }))
  }

  shiftFilter = (filter) => {
    this.setState({ filter })
  }

  sortTasks = () => {
    const { tasks, filter } = this.state
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed)
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }
    return tasks
  }

  removeCompletedTasks = () => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((task) => !task.completed),
    }))
  }

  descriptionChange = (id, newDescription) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) => (task.id === id ? { ...task, description: newDescription } : task)),
    }))
  }

  render() {
    const { tasks } = this.state
    const { filter } = this.state
    return (
      <div className="todoapp">
        <Header>
          <NewTaskForm addTask={this.addTask} />
        </Header>
        <TaskList
          tasks={this.sortTasks()}
          removeTask={this.removeTask}
          toggleTaskCompletion={this.toggleTaskCompletion}
          descriptionChange={this.descriptionChange}
        />
        <Footer
          taskItem={tasks.filter((task) => !task.completed).length}
          removeCompletedTasks={this.removeCompletedTasks}
        >
          <TasksFilter filter={filter} shiftFilter={this.shiftFilter} />
        </Footer>
      </div>
    )
  }
}

export default App
