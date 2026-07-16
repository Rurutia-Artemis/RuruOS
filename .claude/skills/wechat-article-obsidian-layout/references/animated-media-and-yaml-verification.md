# Animated media and real YAML verification

Use this after a WeChat article contains GIFs or when the deterministic note checker passes but a true YAML parse has not yet run.

## Preserve animated media

- Keep a genuine article GIF as `.gif` by default. Do **not** convert it to APNG merely to satisfy a verifier: conversion can inflate a small source GIF into a much larger attachment.
- Download the original public asset, verify non-zero size, HTTP content type, and the `GIF87a` / `GIF89a` signature. `scripts/verify_ruruos_wechat_note.py` accepts PNG, JPEG, and GIF signatures.
- Convert only when the target reader demonstrably cannot render GIF. If conversion is necessary, state it in `来源与备注` and verify the output frame count rather than assuming animation survived.
- Optional frame check:

```bash
ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames -of default=nw=1:nk=1 '<asset>'
```

- Final media accounting remains three-way: filtered正文图数 = local attachment count = Markdown embed count.

## Parse frontmatter with a real YAML parser

The deterministic checker validates frontmatter boundaries, allowed key order, source URL, and dedup key, but those string checks are not a substitute for YAML parsing.

On macOS, Ruby's standard-library Psych parser is a dependency-free fallback when Python `yaml` is unavailable. RuruOS uses unquoted ISO dates, so permit `Date` explicitly:

```bash
ruby -rdate -ryaml -e '
  text = File.read(ARGV[0], encoding: "UTF-8")
  frontmatter = text.split(/^---\s*$\n?/)[1]
  data = YAML.safe_load(frontmatter, permitted_classes: [Date], aliases: false)
  abort("frontmatter is not a mapping") unless data.is_a?(Hash)
  puts "YAML_OK #{data.keys.join(",")}" 
' '<note.md>'
```

If a project-local Python environment already has PyYAML, `yaml.safe_load` is also valid. Do not install a global package solely for this check.

## Completion condition

Report success only after both layers pass:

1. `verify_ruruos_wechat_note.py` returns `"ok": true`.
2. A real YAML parser loads the frontmatter as a mapping.
