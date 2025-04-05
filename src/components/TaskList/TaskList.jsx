import Task from '../Task/Task'
import './TaskList.css'

function TaskList({ tasks, removeTask, toggleTaskCompletion, descriptionChange, timers, updateTimer }) {
  return (
    <ul className="todo-list">
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          removeTask={() => removeTask(index)}
          toggleTaskCompletion={() => toggleTaskCompletion(index)}
          descriptionChange={descriptionChange}
          remainingTime={timers[task.id] || 0}
          updateTimer={updateTimer}
          isActive={task.isActive}
        />
      ))}
    </ul>
  )
}

TaskList.defaultProps = {
  tasks: [],
  removeTask: () => {},
  toggleTaskCompletion: () => {},
  descriptionChange: () => {},
}

export default TaskList
