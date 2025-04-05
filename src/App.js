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
      timers: {},
    }
  }

  componentDidMount() {
    this.startTimers()
  }

  componentWillUnmount() {
    this.stopTimers()
  }

  addTask = (task) => {
    const newTask = { ...task, id: uuidv4(), completed: false, created: Date.now(), isActive: false }
    if (task.description.trim() !== '') {
      this.setState((prevState) => ({
        tasks: [...prevState.tasks, newTask],
        timers: { ...prevState.timers, [newTask.id]: task.duration || 0 },
      }))
    }
  }

  removeTask = (index) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.toSpliced(index, 1),
    }))
  }

  toggleTaskCompletion = (index) => {
    this.setState((prevState) => {
      const task = prevState.tasks[index]
      const newTimers = { ...prevState.timers }
      if (!task.completed) {
        newTimers[task.id] = 0
      }
      return {
        tasks: prevState.tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed, isActive: false } : t)),
        timers: newTimers,
      }
    })
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

  updateTimer = (id, remainingTime, isActive) => {
    this.setState((prevState) => {
      const newTimers = { ...prevState.timers }
      newTimers[id] = remainingTime
      const updatedTasks = prevState.tasks.map((task) =>
        task.id === id ? { ...task, isActive: !task.completed ? isActive : false } : task
      )
      return { timers: newTimers, tasks: updatedTasks }
    })
  }

  startTimers = () => {
    this.interval = setInterval(() => {
      this.setState((prevState) => {
        const newTimers = { ...prevState.timers }
        Object.keys(newTimers).forEach((id) => {
          const currentTask = prevState.tasks.find((task) => task.id === id)
          if (newTimers[id] > 0 && currentTask && currentTask.isActive) {
            newTimers[id] -= 1
          }
        })
        return { timers: newTimers }
      })
    }, 1000)
  }

  stopTimers = () => {
    clearInterval(this.interval)
  }

  render() {
    const { tasks, filter, timers } = this.state
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
          timers={timers}
          updateTimer={this.updateTimer}
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
