import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

function adminNavCls({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'admin-dash-nav-item admin-dash-nav-item--active'
    : 'admin-dash-nav-item'
}

function adminTopTabCls({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'admin-dash-top-tab admin-dash-top-tab--active'
    : 'admin-dash-top-tab'
}

function AdminPrimaryNavLinks() {
  return (
    <>
      <NavLink to="/admin" end className={adminNavCls}>
        Overview
      </NavLink>
      <NavLink to="/admin/revenue" className={adminNavCls}>
        Revenue
      </NavLink>
      <NavLink to="/admin/families" className={adminNavCls}>
        Families
      </NavLink>
      <NavLink to="/admin/users" className={adminNavCls}>
        Users
      </NavLink>
    </>
  )
}

function AdminTopTabLinks() {
  return (
    <>
      <NavLink to="/admin" end className={adminTopTabCls}>
        Overview
      </NavLink>
      <NavLink to="/admin/revenue" className={adminTopTabCls}>
        Revenue
      </NavLink>
      <NavLink to="/admin/families" className={adminTopTabCls}>
        Families
      </NavLink>
      <NavLink to="/admin/users" className={adminTopTabCls}>
        Users
      </NavLink>
    </>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-dash">
      <header className="admin-dash-header">
        <Link to="/" className="admin-dash-logo">
          Famio admin
        </Link>
        <div className="admin-dash-header-end">
          <span className="admin-dash-user">{user?.email}</span>
          <button
            type="button"
            className="btn btn-ghost admin-dash-logout"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      <aside className="admin-dash-sidebar" aria-label="Admin navigation">
        <nav className="admin-dash-nav">
          <AdminPrimaryNavLinks />
        </nav>
      </aside>

      <div className="admin-dash-body">
        <nav
          className="admin-dash-top-tabs"
          aria-label="Admin navigation (mobile)"
        >
          <AdminTopTabLinks />
        </nav>
        <Outlet />
      </div>
    </div>
  )
}
