import './Header.css'

export default function Header({ children }) {
  return (
    <header className="header">
      <h1>todos</h1>
      {children}
    </header>
  )
}

Header.defaultProps = {
  children: null,
}
