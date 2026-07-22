Map: [[Upskill/ProgramLang/Golang/Go|Go]]
Connections: [[Upskill/ProgramLang/Golang/Context|Context]]

What Even Is an **Event Bus**?

Imagine a radio station 📻.
- The station broadcasts a show (publishes an event)
- Anyone with a radio tuned to that station hears it (subscriber receives it)
- The station doesn't know or care who is listening

That's an event bus. Different parts of your app can talk to each other without knowing about each other.
One part says "hey, something happened!" and anyone who cares gets notified.
