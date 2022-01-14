import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from './LoadingSpinner'
import ErrorAlert from './ErrorAlert'
import BasePaginatedList from './BasePaginatedList'

function DefaultListItem({ item }) {
  return (
    <Link href={item.href}>
      <a>{item.title}</a>
    </Link>
  )
}

export default function PaginatedList({
  loadItems, ListItem, emptyMessage, itemsPerPage = 15, className,
}) {
  const [listItems, setListItems] = useState(null)
  const [totalCount, setTotalCount] = useState(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)

  const itemComponent = typeof ListItem === 'function' ? ListItem : DefaultListItem

  useEffect(() => {
    const fetchItems = async (limit, offset) => {
      try {
        const { items, count } = await loadItems(limit, offset)
        setListItems(items)
        setTotalCount(count)
      } catch (apiError) {
        setError(apiError)
      }
    }

    if (typeof loadItems === 'function') {
      const offset = (page - 1) * itemsPerPage
      fetchItems(itemsPerPage, offset)
    }
  }, [loadItems, page, itemsPerPage])

  useEffect(() => {
    // Reset page when loading function changes
    setPage(1)
  }, [loadItems])

  if (!listItems) return <LoadingSpinner inline />

  if (error) return <ErrorAlert error={error} />

  return (
    <BasePaginatedList
      listItems={listItems}
      totalCount={totalCount}
      itemsPerPage={itemsPerPage}
      currentPage={page}
      setCurrentPage={setPage}
      ListItem={itemComponent}
      emptyMessage={emptyMessage}
      className={className}
    />
  )
}