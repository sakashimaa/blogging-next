import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React from 'react'

const PublishBlogDialog = ({
  topics,
  setTopics,
  onSubmit,
}: {
  topics: string[]
  setTopics: (topics: string[]) => void
  onSubmit: () => void
}) => {
  const [inputValue, setInputValue] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const addTopic = (raw: string) => {
    const name = raw.trim()
    if (!name) return
    if (topics.length >= 5) return
    if (topics.some((t) => t.toLowerCase() === name.toLowerCase())) return
    setTopics([...topics, name])
  }

  const removeTopic = (name: string) => {
    setTopics(topics.filter((t) => t !== name))
  }

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTopic(inputValue)
      setInputValue('')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="dark">Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Blog</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="topics">Topics (up to 5)</Label>
            <div className="min-h-12 w-full rounded-md border border-neutral-300 bg-neutral-50 px-2 py-2">
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-sm shadow-sm border border-neutral-200"
                  >
                    {t}
                    <button
                      type="button"
                      aria-label={`Remove ${t}`}
                      className="ml-1 text-neutral-500 hover:text-neutral-800"
                      onClick={() => removeTopic(t)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {topics.length < 5 && (
                  <Input
                    id="topics"
                    name="topics"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleTopicKeyDown}
                    placeholder="Add a topic..."
                    className="h-8 w-auto flex-1 min-w-[120px] border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-neutral-400"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="dark"
            className="w-full"
            onClick={() => {
              onSubmit()
              setOpen(false)
            }}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PublishBlogDialog
