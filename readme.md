diem
====

A daily todo list.

![example](https://i.imgur.com/20kSi94.gif)

Install
---

#### With cargo

```bash
cargo install --git https://github.com/whytheplatypus/diem.git
```

Log structure
---

```
<date> <action> <task description>
.
.
.
```

`<date>` is of the form `YYYY-MM-DD`

`<action>` is in the set `{add, complete, remove}`

The state of a task for today will be found by "replaying" the log.
