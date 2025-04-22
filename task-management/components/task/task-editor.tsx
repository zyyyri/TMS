"use client"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, ImageIcon, Link, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TaskEditor() {
  const [content, setContent] = useState(
    "This presentation should cover the following topics:\n\n" +
      "- Q1 Performance Review\n" +
      "- New Product Launch Strategy\n" +
      "- Competitive Analysis\n" +
      "- Q2 Marketing Goals\n\n" +
      "The presentation should be ready by April 28th for the executive team review.",
  )

  const insertText = (before: string, after = "") => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newText)

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + before.length + selectedText.length + after.length
    }, 0)
  }

  const insertBold = () => insertText("**", "**")
  const insertItalic = () => insertText("*", "*")
  const insertBulletList = () => insertText("\n- ")
  const insertNumberedList = () => insertText("\n1. ")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Button variant="ghost" size="sm" onClick={insertBold}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertItalic}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertBulletList}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertNumberedList}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Insert Image</h4>
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input id="image-url" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input id="image-alt" placeholder="Image description" />
              </div>
              <Button
                className="w-full"
                onClick={() => insertText("![Image description](https://example.com/image.jpg)")}
              >
                Insert Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Insert Link</h4>
              <div className="space-y-2">
                <Label htmlFor="link-text">Link Text</Label>
                <Input id="link-text" placeholder="Link text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input id="link-url" placeholder="https://example.com" />
              </div>
              <Button className="w-full" onClick={() => insertText("[Link text](https://example.com)")}>
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Insert File</h4>
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <Input id="file-upload" type="file" />
              </div>
              <Button className="w-full">Upload and Insert</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Textarea className="min-h-[300px] font-mono" value={content} onChange={(e) => setContent(e.target.value)} />
    </div>
  )
}
