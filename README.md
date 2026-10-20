# Latin notes

My Latin notes as a phone app that works offline.

## Editing

The notes are in [notes/latin.md](notes/latin.md). Open it, tap the pencil icon, make your changes, then **Commit changes**. The site updates within a minute or two; the app on your phone picks it up the next time you open it with signal.

There's a formatting guide at the top of that file.

## Adding another language

1. Add a file to the `notes` folder, e.g. `notes/greek.md`, using the same format.
2. Add a line for it in `notebooks.json`. Every line except the last needs a comma at the end:

```
[
  { "title": "Latin", "file": "notes/latin.md", "verbs": "notes/latin-verbs.json" },
  { "title": "Greek", "file": "notes/greek.md" }
]
```

The app then opens on a list of notebooks.
