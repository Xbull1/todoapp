import './App.css'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import TaskList from './components/TaskList/TaskList'
import NewTaskForm from './components/NewTaskForm/NewTaskForm'
import Footer from './components/Footer/Footer'
import TasksFilter from './components/TasksFilter/TasksFilter'
import Header from './components/Header/Header'

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      completed: false,
      created: Date.now(),
      remainingTime: task.duration || 0,
      timerStartTime: null,
    }
    if (task.description.trim() !== '') {
      setTasks((prevTask) => [...prevTask, newTask])
    }
  }

  const sortTasks = () => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed)
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }
    return tasks
  }

  const removeTask = (index) => {
    setTasks((prevTask) => prevTask.toSpliced(index, 1))
  }

  const toggleTaskCompletion = (id) => {
    setTasks((prevState) =>
      prevState.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              timerStartTime: null,
            }
          : t
      )
    )
  }

  const descriptionChange = (id, newDescription) => {
    setTasks((prevTask) => prevTask.map((task) => (task.id === id ? { ...task, description: newDescription } : task)))
  }

  const updateTaskTimer = (id, remainingTime, timerStartTime) => {
    setTasks((prevTask) => prevTask.map((task) => (task.id === id ? { ...task, remainingTime, timerStartTime } : task)))
  }

  const removeCompletedTasks = () => {
    setTasks((prevTask) => prevTask.filter((task) => !task.completed))
  }

  const shiftFilter = (filterInfo) => {
    setFilter(filterInfo)
  }
  return (
    <div className="todoapp">
      <Header>
        <NewTaskForm addTask={addTask} />
      </Header>
      <TaskList
        tasks={sortTasks()}
        removeTask={removeTask}
        toggleTaskCompletion={toggleTaskCompletion}
        descriptionChange={descriptionChange}
        updateTaskTimer={updateTaskTimer}
      />
      <Footer taskItem={tasks.filter((task) => !task.completed).length} removeCompletedTasks={removeCompletedTasks}>
        <TasksFilter filterInfo={filter} shiftFilter={shiftFilter} />
      </Footer>
    </div>
  )
}

export default App
