import { useContext } from 'react'
import Link from 'next/link'
import UserContext from './UserContext'
import api from '../lib/api-client'
import { handleLogout } from '../lib/auth'

const NavUserLinks = () => {
  const { user, setLoggedInUser } = useContext(UserContext)
  const logout = (e) => {
    e.preventDefault()

    api.post('/logout')
      .then(() => {
        setLoggedInUser(null, null)
        handleLogout()
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
      })
  }

  if (!user) {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li id="user-menu"><Link href="/login"><a>Login</a></Link></li>
      </ul>
    )
  }

  return (
    <ul className="nav navbar-nav navbar-right">
      <li className="hidden-sm"><Link href="/activity"><a>Activity</a></Link></li>
      <li className="hidden-sm"><Link href="/tasks"><a>Tasks</a></Link></li>
      <li id="user-menu" className="dropdown">
        <a
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <span>{user.profile.first} {user.profile.middle} {user.profile.last}</span>
          {' '}
          <span className="caret" />
        </a>

        <ul className="dropdown-menu">
          <li>
            <Link href={`/profile?id=${user.profile.id}`}><a>Profile</a></Link>
          </li>
          <li className="visible-sm-block">
            <Link href="/activity"><a>Activity</a></Link>
          </li>
          <li className="visible-sm-block">
            <Link href="/tasks"><a>Tasks</a></Link>
          </li>
          <li role="separator" className="divider hidden-xs" />
          <li>
            <a href="/logout" onClick={logout}>Logout</a>
          </li>
        </ul>
      </li>
    </ul>
  )
}

export default NavUserLinks