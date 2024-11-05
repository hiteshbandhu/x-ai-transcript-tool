'use client'
import React, { useState, useEffect } from 'react'

interface ActionItem {
  id: string
  text: string
  completed: boolean
}

interface DocumentSummary {
  id: string
  title: string
  summary: string
  participants?: string[]
  date?: string
  duration?: string
  keyPoints: string[]
  actionItems: string[]
  nextSteps?: string[]
  originalText: string
}

const Page = () => {
  const [prompt, setPrompt] = useState('')
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [summaries, setSummaries] = useState<DocumentSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const savedItems = localStorage.getItem('actionItems')
    const savedSummaries = localStorage.getItem('summaries')
    const auth = localStorage.getItem('auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    if (savedItems) {
      setActionItems(JSON.parse(savedItems))
    }
    if (savedSummaries) {
      setSummaries(JSON.parse(savedSummaries))
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'wetrsfrm@2024') { // Hardcoded for security since client-side env vars aren't accessible
      setIsAuthenticated(true)
      localStorage.setItem('auth', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/v1/action-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      const jsonString = data.result.replace(/```json\n|\n```/g, '')
      const parsedResult = JSON.parse(jsonString) as Omit<DocumentSummary, 'id' | 'originalText'>
      
      const newSummary: DocumentSummary = {
        ...parsedResult,
        id: crypto.randomUUID(),
        originalText: prompt
      }

      const updatedSummaries = [...summaries, newSummary]
      setSummaries(updatedSummaries)
      localStorage.setItem('summaries', JSON.stringify(updatedSummaries))

      const newItems = parsedResult.actionItems.map((item: string) => ({
        id: crypto.randomUUID(),
        text: item,
        completed: false
      }))

      const updatedItems = [...actionItems, ...newItems]
      setActionItems(updatedItems)
      localStorage.setItem('actionItems', JSON.stringify(updatedItems))
      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate action items')
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (id: string) => {
    const updatedItems = actionItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setActionItems(updatedItems)
    localStorage.setItem('actionItems', JSON.stringify(updatedItems))
  }

  const deleteSummary = (id: string) => {
    const updatedSummaries = summaries.filter(s => s.id !== id)
    setSummaries(updatedSummaries)
    localStorage.setItem('summaries', JSON.stringify(updatedSummaries))
    if (selectedSummary === id) setSelectedSummary(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6">For use of we.trsfrm</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button 
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Transcript Analysis Tool</h1>
          <p className="text-gray-600">Made with ❤️ by <a href="https://x.com/_hiteshbandhu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@_hiteshbandhu</a></p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your meeting notes, transcript or document to analyze. Make sure they are not too loooooooooooooooooooooooong!"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
            required
          />
          <div className="mt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${selectedSummary ? 'blur-sm' : ''}`}>
          {summaries.map(summary => (
            <div 
              key={summary.id} 
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md hover:scale-105"
              onClick={() => setSelectedSummary(summary.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{summary.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSummary(summary.id)
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{summary.summary}</p>
            </div>
          ))}
        </div>

        {selectedSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  {summaries.find(s => s.id === selectedSummary)?.title}
                </h2>
                <button
                  onClick={() => setSelectedSummary(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {summaries.find(s => s.id === selectedSummary) && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Summary</h3>
                    <p className="text-gray-600">{summaries.find(s => s.id === selectedSummary)?.summary}</p>
                  </div>

                  {summaries.find(s => s.id === selectedSummary)?.participants && (
                    <div>
                      <h3 className="font-medium mb-2">Participants</h3>
                      <p className="text-gray-600">{summaries.find(s => s.id === selectedSummary)?.participants?.join(', ')}</p>
                    </div>
                  )}

                  {summaries.find(s => s.id === selectedSummary)?.keyPoints.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Key Points</h3>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {summaries.find(s => s.id === selectedSummary)?.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summaries.find(s => s.id === selectedSummary)?.actionItems.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Action Items</h3>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {summaries.find(s => s.id === selectedSummary)?.actionItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summaries.find(s => s.id === selectedSummary)?.nextSteps?.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Next Steps</h3>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {summaries.find(s => s.id === selectedSummary)?.nextSteps?.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <details className="text-sm text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700">Show Original Text</summary>
                    <p className="mt-2 whitespace-pre-wrap text-xs">
                      {summaries.find(s => s.id === selectedSummary)?.originalText}
                    </p>
                  </details>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page