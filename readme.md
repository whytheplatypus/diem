## Log structure
```
<date> <action> <task description>
.
.
.
```

`<date>` is of the form `YYYY-MM-DD`

`<action>` is in the set `{add, complete, remove}`

`<task description>` is a string, all characters matching `\d\d\d\d-\d\d-\d\d (?:add|complete|remove) (.+)`

The state of a task for today will be found by "replaying" the log.

```
todo_list

for date, action, task in log
    <action> <task> todo_list
    // add "some task" todo_list
    // complete "some task" todo_list

```

`add`
```
add(task, list)
    push task list
```

`remove`
```
remove(task, list)
    if task in list
        delete task list
```

`complete`
```
complete(task, list)
    remove(task, list)
```

The presents of `<date>` allows the log to recover from any incorrect insert by sorting entries by date if necissary.

## Style

done: ✓ U+2713
open: ◯ U+25EF

colors: https://nipponcolors.com/

## interactions

calm tech principles?
- > Technology should inform and create calm
- > The right amount of technology is the minimum needed to solve the problem
- > Technology should respect social norms
