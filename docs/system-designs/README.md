# System designs checkpoint

**Project:** Material Derailleur / BWorks

**Date:** October 19, 2026

**Source snapshot:** `3c75abdc` (local checkout; documentation-only artifact)

[Submit this checkpoint index](README.md) with the [one-page context](context.md) and four linked Markdown design artifacts below. Each artifact contains a Mermaid diagram that renders in GitHub's Markdown view.

| Deliverable                         | Markdown artifact                                | What it communicates                                                                     |
| ----------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| One-page context                    | [Context](context.md)                            | Rationale, trade-offs, development use and current versus proposed state                 |
| Current architecture and deployment | [Architecture](01-system-architecture.md)        | Browser, React, API modules, PostgreSQL, integrations and local Compose ports            |
| Current data model                  | [Data model](02-data-model.md)                   | Six entities, keys, optionality and relationship multiplicities                          |
| Current status workflow             | [Status workflow](03-current-status-workflow.md) | Submission, immediate item mutation, review, donor timeline and email                    |
| Proposed design                     | [Proposed design](04-proposed-design.md)         | Staged changes, atomic approval, retained rejections and retryable notification delivery |

The Markdown files contain the editable diagram definitions. No online design tool was used. The proposed design has an explicit label and dashed boxes; it describes recommendations for discussion with BWorks. After committing and pushing these files, submit the GitHub URL for this index, or the individual Markdown file URLs. Use the rendered file view so the diagrams are visible.

## Evidence and accessible descriptions

[Source map and text equivalents](source-map.md) link each view to repository code and explain the diagrams in reading order. The documentation describes code and checked-in deployment configuration; it does not assert that a production installation was inspected. The older checkpoint PDF in the repository root is retained as historical material.

## Updating the artifacts

Edit the Mermaid blocks directly in the four Markdown artifacts. Update the context and source map when behavior changes. The short context remains available as [Markdown](context.md) and a [one-page PDF](context.pdf).

## Optional PDF and SVG exports

The earlier [combined PDF](system-designs.pdf) and [SVG diagrams](diagrams/) are also retained. The [drawing source](source/build_artifacts.py) regenerates those exports and the context Markdown; it does not generate or overwrite the four Mermaid Markdown files. It requires Python 3 with `pycairo` and a sans-serif font (DejaVu Sans was used).

```bash
python3 docs/system-designs/source/build_artifacts.py
```

For PNG previews, add `--preview-dir /tmp/material-derailleur-design-preview`. Keep export labels and the Markdown diagrams aligned if you update both formats. Rebuilding alone does not re-audit the repository.
