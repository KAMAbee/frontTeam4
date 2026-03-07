import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  requestsMock,
  sessionsMock,
  trainingsMock,
  REQUEST_STATUS_LABELS,
} from "../manager/manager.mock"

import styles from "../../manager/ManagerPages.module.scss"

const ITEMS_PER_PAGE = 7

export const RequestsPage = () => {
  const navigate = useNavigate()

  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRequests = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) return requestsMock

    return requestsMock.filter((request) => {
      const session = sessionsMock.find((s) => s.id === request.sessionId)
      const training = trainingsMock.find(
        (t) => t.id === session?.trainingId
      )

      const text = [
        request.id,
        REQUEST_STATUS_LABELS[request.status],
        training?.title,
      ]
        .join(" ")
        .toLowerCase()

      return text.includes(query)
    })
  }, [searchValue])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredRequests, currentPage])

  return (
    <section className={styles.managerPage}>
      <header className={styles.managerPage__header}>
        <div className={styles.managerPage__headerContent}>
          <h1 className={styles.managerPage__title}>Requests</h1>

          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.managerPage__content}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Training</th>
              <th>City</th>
              <th>Employees</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((request) => {
              const session = sessionsMock.find(
                (s) => s.id === request.sessionId
              )

              const training = trainingsMock.find(
                (t) => t.id === session?.trainingId
              )

              return (
                <tr
                  key={request.id}
                  onClick={() =>
                    navigate(`/admin/requests/${request.id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{request.id}</td>
                  <td>{training?.title}</td>
                  <td>{session?.city}</td>
                  <td>{request.employees.length}</td>
                  <td>{REQUEST_STATUS_LABELS[request.status]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
