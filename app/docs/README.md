---
title: "kurasu: docs"
summary: "The docs: what each folder holds, how files are named, and how to write a note."
---

# kurasu: docs

## What each folder holds

| Folder | Holds | Index |
|---|---|---|
| architecture/ | the shape of the system and how each part works | [Architecture](architecture/README.md) |
| prototipos/ | no notes, only the HTML prototypes of the screens that the notes link to | [Prototipos](prototipos/README.md) |

There is a single note folder, so every note goes in `architecture/`, whatever part of the system it explains.

`_templates/` holds no notes. The underscore is a sorting convention and nothing more: it floats the folder to the top of the file explorer.

`prototipos/` holds no notes either: it holds the HTML prototypes of the screens, and each one is linked from the note that describes its screen.

## Naming

A note is named after the aspect it explains, in kebab-case. Not after its folder, not numbered, not dated: a date is a frontmatter field, so an index can sort on it without every filename carrying one.

File names are unique across the whole docs folder, so a link never has to be disambiguated. Before adding a note, check the name is not taken.

Every folder's index is called `README.md`, so that name is the one deliberate collision here: the payoff is that each index renders as a folder front page when the repository is browsed on the web. A link to a folder's index names the folder: `[the technical design](technical-design/README.md)`.

## Frontmatter

Every note carries `title` and `summary`, plus `created`. The summary is what shows up in search, in hover previews and in the indexes, so write it as a sentence about the subject rather than about the note.

## How to write a note

**A note explains how one part works.** It opens with an overview a reader can stop after, then the mechanism: the shape of the data, what calls what, in what order, with a diagram when the subject is a flow, a tree or a sequence. A reader should be able to hold that part of the system in their head without opening `src/` first.

`_templates/note.md` offers the sections a note can use. They are a menu, not a required shape and not a closed list: keep the ones the subject needs, add one the menu lacks when the subject asks for it, and order them so the note is easiest to follow rather than in the order the template lists them. Edge cases and failure modes go in the prose or in a callout, never in a section of their own.

**Reasoning goes in a callout, beside the thing it justifies**, not as the spine of the note:

```markdown
> [!NOTE] Why it is this way and not the obvious alternative
> The reasoning, next to the mechanism it justifies.
```

A note that opens with the argument for a design makes the reader meet the case for the architecture before the architecture itself, and the argument is not what they came for. It is still worth keeping (it is what lets a decision be revisited rather than re-argued); it just is not the spine. Per-decision *why* is also the one thing the code already has, densely, at the point of each decision; what code cannot give anyone is the shape of the whole.

Three callout kinds, and they mean different things:

- `> [!NOTE]`: a real choice, and why it went that way.
- `> [!WARNING]`: a failure mode: what breaks, how it presents, and whether anything catches it. Prefer failures that have actually happened.
- `> [!TIP]`: an alternative considered and not taken, with the reason it was not.

**A note is not a decision record.** There is no requirements table, no acceptance criteria, no user story, no status ladder. Those describe work being planned; a note describes something that exists.

**A note describes the present.** No "used to", no "previously", no "no longer". An alternative that was rejected is *considered and not chosen, because…*, a standing reason, not a history of the argument. A note describes the system, not the state of its construction: no section on what is built, pending or planned.

Create a note from `_templates/note.md`. Then **link it from at least one existing note** and add its row to its folder's index: a note nothing links to does not get read.

## House style

- **No hard wrapping.** One line per paragraph; let the editor wrap. Diffs then show changed sentences rather than reflowed blocks.
- **Explain the code, do not reprint it.** A note is not a second copy of a declaration. The surface goes in a table of what each member answers, behaviour goes in a diagram or in prose, and a snippet appears only where the code itself is the insight: an exact formula, a guard whose precise form is the point. Two to four lines when it happens. Written the other way, a note comes out a third fenced code, in a second place where nothing typechecks it and it quietly falls out of date.
- **Mermaid, not ASCII**, for anything with a shape. A state machine, a data model, a request's path through the system and a tree all read faster as a diagram than as a paragraph describing one, and both GitHub and Obsidian render mermaid.
- **Headings name their subject, and carry an emoji.** "Extraction" and "The extraction" give a reader nothing to search for; "how a URL becomes paragraphs" does. Prefer a heading that could answer a question someone typed into search. Every heading in a note opens with one emoji chosen for its subject (`## 💽 Modeling`, `### 🔑 Login`), so a reader scanning the outline sees the shape of the note before the words; the template carries the usual ones and a section you add picks its own.
- **Say what a thing is.** Staging a sentence against its own opposite ("it does not reject the unknown kind, it ignores it") reads as emphasis while carrying no information the plain form lacks. Write the plain form.
- **Prefer commas, colons and full stops to dashes.** A paragraph leaning on dashes is usually one that wants to be two sentences.
- **Write about our implementation.** A comparison with some other tool belongs inside a callout that justifies a decision, and nowhere else; a note is not a literature review.
- Close a note with a `---` rule and a `Related:` line linking the notes it actually touches.

## Adding a folder

A folder is three things, and they have to agree:

1. The directory.
2. A `README.md` in it, carrying that folder's index.
3. A row in the folder table above.

`mahou:init` will do all three and leave anything that already exists alone, or do it by hand from this list: the skills read what is here either way. What breaks is doing two of the three: a folder with no row is invisible to anyone reading this file, and a row with no folder sends people looking for something that is not there.
