use chrono::Local;
use dirs;
use std::env;
use std::fmt;
use std::fs::{File, OpenOptions};
use std::io::Write;
use std::io::{BufRead, BufReader};
use std::path::PathBuf;

const VERSION: &'static str = env!("CARGO_PKG_VERSION");
const AUTHORS: &'static str = env!("CARGO_PKG_AUTHORS");
const TODO_LOG: &'static str = ".diem.log";

fn get_banner() -> std::string::String {
    format!("{} Version {}
Manage daily tasks on the commandline\n", AUTHORS, VERSION,)
}

fn usage() {
    println!("{}", get_banner());
    println!("{}", "USAGE:
    diem [{add | complete | remove} <task description>]");
}

struct Config {
    log_file: PathBuf,
}

impl Config {
    pub fn default() -> Config {
        Config{
           log_file: dirs::home_dir().unwrap().join(TODO_LOG)
        }
    }
}

fn main() -> std::io::Result<()> {
    let conf: Config = Config::default();
    let args: Vec<String> = std::env::args().collect();
    match &args[..] {
        [_] => todays_list(&conf.log_file),
        [_, cmd, task @ ..] if cmd.parse::<diem::Action>().is_ok() => record(
            diem::Event(
                Local::today().naive_local(),
                cmd.parse::<diem::Action>()
                    .expect("unable to parse todo action"),
                String::from(task.join(" ")),
            ),
            &conf.log_file,
        ),
        _ => Ok(usage()),
    }
}

fn record(e: diem::Event, path: &PathBuf) -> std::io::Result<()> {
    let mut file = OpenOptions::new()
        .append(true)
        .create(true)
        .open(path)
        .expect("[ ERROR ] Failed to open file!");
    file.write_fmt(format_args!("{}\n", e))
}

fn todays_list(path: &PathBuf) -> std::io::Result<()> {
    let file = File::open(path).expect("[ ERROR ] Failed to open file!");

    let reader = BufReader::new(file);

    let mut task_list = diem::List::new();

    for line in reader.lines() {
        let content = line.unwrap();
        let e = content
            .parse::<diem::Event>()
            .expect("[ ERROR ] failed to parse file!");
        task_list = diem::apply(e, task_list);
    }
    println!("{}", CLIList(task_list));
    Ok(())
}

struct CLIList(diem::List);

impl fmt::Display for CLIList {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut task_display = String::new();

        for task in &self.0 {
            task_display.push_str(&format!("{}", CLIEvent(task)));
        }
        write!(f, "{}", task_display)
    }
}

struct CLIEvent<'a>(&'a diem::Event);

impl fmt::Display for CLIEvent<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let today = Local::today().naive_local();
        if (self.0).0 < today {
            return write!(f, "❬ {}\n", (self.0).2);
        }
        write!(f, "◯ {}\n", (self.0).2)
    }
}
