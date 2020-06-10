extern crate chrono;

use chrono::NaiveDate;
use std::fmt;
use std::str::FromStr;

pub type List = Vec<Event>;

type Day = NaiveDate;

#[derive(Debug)]
pub enum Action {
    Add,
    Remove,
    Complete,
}

#[derive(Debug)]
pub struct ActionParseError;

impl fmt::Display for ActionParseError {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        fmt.write_str("invalid todo action")
    }
}

impl FromStr for Action {
    type Err = ActionParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "add" => Ok(Action::Add),
            "remove" => Ok(Action::Remove),
            "complete" => Ok(Action::Complete),
            _ => Err(ActionParseError),
        }
    }
}

impl fmt::Display for Action {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Action::Add => fmt.write_str("add"),
            Action::Remove => fmt.write_str("remove"),
            Action::Complete => fmt.write_str("complete"),
        }
    }
}

#[derive(Debug)]
pub struct Event(pub Day, pub Action, pub String);

impl fmt::Display for Event {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        fmt.write_fmt(format_args!("{} {} {}", self.0, self.1, self.2))
    }
}

#[derive(Debug)]
pub struct EventParseError;

impl fmt::Display for EventParseError {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        fmt.write_str("invalid todo action")
    }
}

impl From<chrono::ParseError> for EventParseError {
    fn from(_error: chrono::ParseError) -> Self {
        EventParseError
    }
}

impl From<ActionParseError> for EventParseError {
    fn from(_error: ActionParseError) -> Self {
        EventParseError
    }
}

impl FromStr for Event {
    type Err = EventParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let v: Vec<&str> = s.splitn(3, ' ').collect();
        let e = Event(
            v[0].parse::<Day>()?,
            v[1].parse::<Action>()?,
            String::from(v[2]),
        );
        Ok(e)
    }
}

pub fn apply(e: Event, todays_list: List) -> List {
    let Event(_, a, _) = &e;
    // map to implementation
    match a {
        Action::Add => add(e, todays_list),
        Action::Remove => delete(e, todays_list),
        Action::Complete => delete(e, todays_list),
    }
}

fn add(task: Event, mut todays_list: List) -> List {
    todays_list.push(task);
    todays_list
}

fn delete(task: Event, mut todays_list: List) -> List {
    todays_list.retain(|x| x.2 != task.2);
    todays_list
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_task() -> Result<(), EventParseError> {
        let mut task_list = List::new();
        task_list = add(
            Event(
                "2020-04-11".parse::<NaiveDate>()?,
                Action::Add,
                String::from("test task"),
            ),
            task_list,
        );
        assert_eq!(
            (task_list.first().expect("failed to load test")).2,
            String::from("test task")
        );
        Ok(())
    }

    #[test]
    fn delete_task() -> Result<(), EventParseError> {
        let mut task_list = vec![Event(
            "2020-04-11".parse::<NaiveDate>()?,
            Action::Add,
            String::from("test task"),
        )];
        task_list = delete(
            Event(
                "2020-04-12".parse::<NaiveDate>()?,
                Action::Complete,
                String::from("test task"),
            ),
            task_list,
        );
        assert!(task_list.is_empty());
        Ok(())
    }

    #[test]
    fn delete_task_not_found() -> Result<(), EventParseError> {
        let first_list = vec![Event(
            "2020-04-12".parse::<NaiveDate>()?,
            Action::Add,
            String::from("test task"),
        )];
        let task_list = delete(
            Event(
                "2020-04-12".parse::<NaiveDate>()?,
                Action::Add,
                String::from("no task"),
            ),
            first_list,
        );
        assert_eq!(task_list.len(), 1);
        Ok(())
    }

    #[test]
    fn apply_events() -> Result<(), chrono::ParseError> {
        let events = vec![
            Event(
                "2020-04-11".parse::<NaiveDate>()?,
                Action::Add,
                String::from("test task"),
            ),
            Event(
                "2020-04-11".parse::<NaiveDate>()?,
                Action::Remove,
                String::from("test task"),
            ),
            Event(
                "2020-04-11".parse::<NaiveDate>()?,
                Action::Add,
                String::from("test task"),
            ),
            Event(
                "2020-04-11".parse::<NaiveDate>()?,
                Action::Complete,
                String::from("test task"),
            ),
            Event(
                "2020-04-11".parse::<NaiveDate>()?,
                Action::Add,
                String::from("last task"),
            ),
        ];
        let mut task_list = List::new();
        for e in events {
            task_list = apply(e, task_list);
        }
        assert_eq!(
            (task_list.first().expect("failed to parse tasks")).2,
            String::from("last task"),
        );
        Ok(())
    }

    #[test]
    fn parse_event() -> Result<(), EventParseError> {
        let e = "2020-04-11 add this is a test".parse::<Event>()?;

        let task_list = apply(e, List::new());
        assert_eq!(
            (task_list.first().expect("failed to parse tasks")).2,
            String::from("this is a test"),
        );

        Ok(())
    }
}
