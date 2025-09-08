import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { searchUsers, type UserProfile } from "@/lib/api"

interface EmployeeSearchProps {
  onSelect: (emp: UserProfile) => void
}

export function EmployeeSearch({ onSelect }: EmployeeSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)

  // debounce search
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const handler = setTimeout(() => {
      setLoading(true)
      searchUsers(query)
        .then(setResults)
        .finally(() => setLoading(false))
    }, 400)

    return () => clearTimeout(handler)
  }, [query])

  const handleSelect = (emp: UserProfile) => {
    onSelect(emp)
    setQuery("")      // clear search
    setResults([])    // hide results
  }

  return (
    <div className="relative">
      <Input
        placeholder="Search employee by name or id..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(user)}
            >
              {user.first_name} {user.last_name} (#{user.id})
            </div>
          ))}
        </div>
      )}
      {loading && query && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-2 text-sm text-gray-500">
          Searching...
        </div>
      )}
    </div>
  )
}
