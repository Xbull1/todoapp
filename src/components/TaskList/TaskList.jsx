import Task from '../Task/Task'
import './TaskList.css'

function TaskList({ tasks, removeTask, toggleTaskCompletion, descriptionChange, updateTaskTimer }) {
  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          removeTask={() => removeTask(task.id)}
          toggleTaskCompletion={() => toggleTaskCompletion(task.id)}
          descriptionChange={descriptionChange}
          updateTaskTimer={updateTaskTimer}
        />
      ))}
    </ul>
  )
}

TaskList.defaultProps = {
  tasks: [],
  removeTask: () => {},
  toggleTaskCompletion: () => {},
  updateTaskDescription: () => {},
  updateTaskTimer: () => {},
}

export default TaskList
