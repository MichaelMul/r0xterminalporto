import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio'

const commands: Record<string, (args: string[]) => string> = {
  help: () =>
    'Available commands: help, cls, dir, echo, whoami, ver, date, time, contact, exit',
  cls: () => '__CLEAR__',
  dir: () =>
    ' Volume in drive C has no label.\n Volume Serial Number is RX-2026-001\n\n Directory of C:\\Users\\R0xyy\n\n<DIR>          Documents\n<DIR>          Projects\n<DIR>          Education\n               readme.txt\n               1 File(s)\n               3 Dir(s)',
  echo: (args) => args.join(' '),
  whoami: () => profile.name,
  ver: () =>
    'Microsoft Windows XP [Version 5.1.2600]\nPortfolioTerminal Edition',
  date: () => new Date().toLocaleDateString(),
  time: () => new Date().toLocaleTimeString(),
  contact: () =>
    `${profile.name}\nEmail: ${profile.email}\nYouTube: https://www.youtube.com/@R0xyy\nLocation: ${profile.location}`,
  exit: () => '__EXIT__',
}

export function CmdApp({ onClose }: { onClose?: () => void }) {
  const [lines, setLines] = useState<string[]>([
    'Microsoft Windows XP [Version 5.1.2600]',
    '(C) Copyright 1985-2001 Microsoft Corp.',
    '',
    `Welcome, ${profile.name}. Type "help" for commands.`,
    '',
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [cmd, ...args] = trimmed.toLowerCase().split(' ')
    const handler = commands[cmd]

    setLines((prev) => [...prev, `C:\\Users\\R0xyy>${raw}`])

    if (!handler) {
      setLines((prev) => [
        ...prev,
        `'${cmd}' is not recognized as an internal or external command.`,
        '',
      ])
      return
    }

    const result = handler(args)
    if (result === '__CLEAR__') {
      setLines([])
      return
    }
    if (result === '__EXIT__') {
      onClose?.()
      return
    }

    setLines((prev) => [...prev, result, ''])
  }

  return (
    <div
      className="app-content app-content--fill cmd-app"
      onClick={() => document.getElementById('cmd-input')?.focus()}
    >
      <div className="cmd-output">
        {lines.map((line, i) => (
          <div key={`${i}-${line.slice(0, 12)}`}>{line || '\u00A0'}</div>
        ))}
        <div className="cmd-input-line">
          <span>C:\Users\R0xyy&gt;</span>
          <input
            id="cmd-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                runCommand(input)
                setInput('')
              }
            }}
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
