Tags: #macos #terminal
Map: [[QoL/Refs/MacOS|MacOS]], [[Upskill/Linux/Shell Tips|Linux shell tips]]

> [!summary]
> Quick reference for common macOS Terminal commands. Use `man <command>` for details.

## Files and search

| Command | Use |
| --- | --- |
| `cd ~/Desktop` | Go to the Desktop folder. |
| `textutil -convert txt -output document.txt document.docx` | Convert a Word document to plain text. |
| `zip archive.zip file` | Zip one file; add `-r` to zip a folder. |
| `lsof /path/to/file` | Find processes using a file. |
| `du -sh *` | Show sizes of visible items in the current folder. |
| `qlmanage -p photo.jpeg` | Preview a file with Quick Look. |
| `sips --resampleWidth 1200 photo.jpeg --out resized.jpeg` | Resize an image and save a copy. |
| `mdls photo.jpeg` | Show Spotlight metadata for a file. |
| `mdfind -name "filename"` | Search Spotlight by filename. |
| `grep -RIn "MacBook" .` | Search files under the current folder. |
| `command -v python3` | Show the executable your shell will run. |

## System

| Command | Use |
| --- | --- |
| `top -o cpu` | Show processes sorted by CPU use. |
| `networkQuality` | Test network speed and responsiveness. |
| `uptime` | Show how long the Mac has been running. |
| `sw_vers` | Show macOS version and build. |
| `system_profiler SPHardwareDataType` | Show hardware details. |
| `system_profiler SPPowerDataType` | Show available battery details. |
| `caffeinate` / `caffeinate -t 3600` | Keep the Mac awake until stopped / for one hour. |

## Audio

| Command | Use |
| --- | --- |
| `say "Hello"` | Speak text aloud. |
| `say -o speech.aiff "Hello"` | Save spoken text to an audio file. |
| `say -v '?'` | List available voices. |
| `afplay audio.aiff` | Play an audio file. |

## Terminal shortcuts

| Shortcut | Use |
| --- | --- |
| `Ctrl+C` | Interrupt the current command. |
| `Ctrl+L` | Clear the screen. |
| `Ctrl+R` | Search command history. |
| `Tab` | Complete a command or path. |
| `Cmd+T` | Open a new Terminal tab. |

## Other handy commands

```bash
osascript -e 'display dialog "Hello"'  # Show a macOS dialog
pbpaste > clipboard.txt                 # Save clipboard text (overwrites file)
screencapture screenshot.png            # Capture the screen
killall Spotify                         # Ask Spotify to quit
clear                                   # Clear the screen
man say                                 # Open a command manual; press q to exit
history                                 # Show shell history
```

Check output paths before writing; `>` overwrites files. Hardware and metadata output can contain private details.
