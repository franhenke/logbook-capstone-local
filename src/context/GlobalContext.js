import { createContext, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { loadFromLocal, saveToLocal } from '../hooks/useLocalStorage'

export const GlobalContext = createContext(null)
export const GlobalProvider = ({ children }) => {
  const [editing, setEditing] = useState(false)
  const initialFormState = {
    id: null,
    date: '',
    place: '',
    category: '',
    caption: '',
    entry: '',
    image: '',
    bookmarked: false,
  }
  const [selectedJournal, setSelectedJournal] = useState(initialFormState)
  const [journalEntries, setJournalEntries] = useState(
    loadFromLocal('myJournalEntries') || []
  )
  useEffect(() => {
    saveToLocal('myJournalEntries', journalEntries)
  }, [journalEntries])

  function handleJournalEntry(newJournalEntry) {
    newJournalEntry.id = uuid()
    setJournalEntries([...journalEntries, newJournalEntry])
  }

  journalEntries.bookmarked = false
  console.log(journalEntries)

  const bookmarkHandler = () => {
    setJournalEntries(
      journalEntries.map((journal) => {
        if (journal.id === journalEntries.id) {
          return {
            ...journal,
            bookmarked: !journal.completed,
          }
        }
        return journal
      })
    )
  }

  const deleteEntry = (id) => {
    setJournalEntries(journalEntries.filter((journal) => journal.id !== id))
    setEditing(false)
  }

  const editRow = (journal) => {
    setEditing(true)
    setSelectedJournal({
      id: journal.id,
      date: journal.date,
      place: journal.place,
      category: journal.category,
      caption: journal.caption,
      entry: journal.entry,
      image: journal.image,
    })
  }

  const updateJournal = (id, updatedJournal) => {
    setEditing(false)
    setJournalEntries(
      journalEntries.map((journal) =>
        journal.id === id ? updatedJournal : journal
      )
    )
  }

  return (
    <GlobalContext.Provider
      value={{
        initialFormState,
        journalEntries,
        setJournalEntries,
        handleJournalEntry,
        editing,
        setEditing,
        selectedJournal,
        setSelectedJournal,
        deleteEntry,
        editRow,
        updateJournal,
        bookmarkHandler,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
