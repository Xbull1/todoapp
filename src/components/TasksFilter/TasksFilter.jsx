import './TasksFilter.css'

function TasksFilter({ filter, shiftFilter }) {
  return (
    <ul className="filters">
      <li>
        <button type="button" className={filter === 'all' ? 'selected' : ''} onClick={() => shiftFilter('all')}>
          All
        </button>
      </li>
      <li>
        <button type="button" className={filter === 'active' ? 'selected' : ''} onClick={() => shiftFilter('active')}>
          Active
        </button>
      </li>
      <li>
        <button
          type="button"
          className={filter === 'completed' ? 'selected' : ''}
          onClick={() => shiftFilter('completed')}
        >
          Completed
        </button>
      </li>
    </ul>
  )
}

TasksFilter.defaultProps = {
  filter: 'all',
  shiftFilter: () => {},
}

export default TasksFilter
