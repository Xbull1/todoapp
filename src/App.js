import './App.css'
import { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
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
    const newTask = {
      ...task,
      id: uuidv4(),
      completed: false,
      created: Date.now(),
      remainingTime: task.duration || 0,
      timerStartTime: null,
    }
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

  toggleTaskCompletion = (id) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              timerStartTime: null,
            }
          : t
      ),
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

  updateTaskTimer = (id, remainingTime, timerStartTime) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) => (task.id === id ? { ...task, remainingTime, timerStartTime } : task)),
    }))
  }

  render() {
    const { tasks, filter } = this.state
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
          updateTaskTimer={this.updateTaskTimer}
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
