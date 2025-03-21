import './Footer.css'

function Footer({ children, taskItem, removeCompletedTasks }) {
  return (
    <footer className="footer">
      <span className="todo-count">{taskItem} items left</span>
      {children}
      <button className="clear-completed" type="button" onClick={removeCompletedTasks}>
        Clear completed
      </button>
    </footer>
  )
}

Footer.defaultProps = {
  taskItem: 0,
  removeCompletedTasks: () => {},
  children: null,
}

export default Footer
