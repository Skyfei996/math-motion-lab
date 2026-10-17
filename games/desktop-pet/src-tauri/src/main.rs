#![cfg_attr(target_os = "windows", windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc, Mutex,
};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, RunEvent, WindowEvent,
};
use tauri_plugin_notification::NotificationExt;

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ScheduledReminder {
    id: String,
    title: String,
    due_at: i64,
    status: String,
}

#[derive(Default)]
struct ReminderSchedule {
    reminders: Mutex<Vec<ScheduledReminder>>,
    delivered: Mutex<HashSet<String>>,
}

#[tauri::command]
fn sync_reminders(reminders: Vec<ScheduledReminder>, state: tauri::State<'_, ReminderSchedule>) {
    let mut current = state
        .reminders
        .lock()
        .unwrap_or_else(|error| error.into_inner());
    *current = reminders;
}

fn collect_due_reminders(
    reminders: &[ScheduledReminder],
    delivered: &mut HashSet<String>,
    now: i64,
) -> Vec<ScheduledReminder> {
    reminders
        .iter()
        .filter(|reminder| {
            reminder.status == "scheduled"
                && reminder.due_at <= now
                && delivered.insert(format!("{}:{}", reminder.id, reminder.due_at))
        })
        .cloned()
        .collect()
}

fn current_time_millis() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as i64
}

fn start_reminder_scheduler(app: tauri::AppHandle) {
    std::thread::spawn(move || loop {
        std::thread::sleep(Duration::from_millis(500));
        let now = current_time_millis();
        let due = {
            let state = app.state::<ReminderSchedule>();
            let reminders = state
                .reminders
                .lock()
                .unwrap_or_else(|error| error.into_inner());
            let mut delivered = state
                .delivered
                .lock()
                .unwrap_or_else(|error| error.into_inner());

            collect_due_reminders(&reminders, &mut delivered, now)
        };

        for reminder in due {
            let _ = app
                .notification()
                .builder()
                .title("格格提醒")
                .body(format!("{}，到时间啦。", reminder.title))
                .show();
            let _ = app.emit("desktop-pet://reminder-fired", reminder);
        }
    });
}

#[cfg(test)]
mod tests {
    use super::{collect_due_reminders, ScheduledReminder};
    use std::collections::HashSet;

    fn reminder(id: &str, due_at: i64, status: &str) -> ScheduledReminder {
        ScheduledReminder {
            id: id.to_string(),
            title: id.to_string(),
            due_at,
            status: status.to_string(),
        }
    }

    #[test]
    fn scheduler_returns_only_due_scheduled_reminders_once() {
        let reminders = vec![
            reminder("due", 900, "scheduled"),
            reminder("future", 1_100, "scheduled"),
            reminder("done", 800, "done"),
        ];
        let mut delivered = HashSet::new();

        let first = collect_due_reminders(&reminders, &mut delivered, 1_000);
        let second = collect_due_reminders(&reminders, &mut delivered, 1_000);

        assert_eq!(first.len(), 1);
        assert_eq!(first[0].id, "due");
        assert!(second.is_empty());
    }

    #[test]
    fn snoozed_due_time_can_fire_again() {
        let mut delivered = HashSet::from(["meeting:900".to_string()]);
        let reminders = vec![reminder("meeting", 1_500, "scheduled")];

        let due = collect_due_reminders(&reminders, &mut delivered, 1_500);

        assert_eq!(due.len(), 1);
        assert_eq!(due[0].due_at, 1_500);
    }
}

fn show_window(app: &tauri::AppHandle, label: &str) {
    if let Some(window) = app.get_webview_window(label) {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn toggle_pet_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("pet") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
}

fn show_task_window(app: &tauri::AppHandle) {
    let _ = app.emit_to("task", "desktop-pet://open-quick", ());
    show_window(app, "task");
}

fn toggle_always_on_top(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("pet") {
        let next = !window.is_always_on_top().unwrap_or(true);
        let _ = window.set_always_on_top(next);
        let _ = app.emit_to("pet", "desktop-pet://always-on-top-changed", next);
    }
}

fn main() {
    let quitting = Arc::new(AtomicBool::new(false));
    let quitting_for_setup = Arc::clone(&quitting);

    let app = tauri::Builder::default()
        .manage(ReminderSchedule::default())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            show_window(app, "pet");
        }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![sync_reminders])
        .setup(move |app| {
            start_reminder_scheduler(app.handle().clone());
            let toggle_pet =
                MenuItem::with_id(app, "toggle-pet", "显示/隐藏格格", true, None::<&str>)?;
            let show_task =
                MenuItem::with_id(app, "show-task", "打开/继续任务", true, None::<&str>)?;
            let toggle_top =
                MenuItem::with_id(app, "toggle-top", "切换始终置顶", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&toggle_pet, &show_task, &toggle_top, &quit])?;
            let quitting_for_tray = Arc::clone(&quitting_for_setup);

            TrayIconBuilder::new()
                .menu(&menu)
                .show_menu_on_left_click(false)
                .tooltip("格格桌面学习伙伴")
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "toggle-pet" => toggle_pet_window(app),
                    "show-task" => show_task_window(app),
                    "toggle-top" => toggle_always_on_top(app),
                    "quit" => {
                        quitting_for_tray.store(true, Ordering::SeqCst);
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_window(tray.app_handle(), "pet");
                    }
                })
                .build(app)?;

            for window in app.webview_windows().values() {
                let window_for_hide = window.clone();
                let quitting_for_window = Arc::clone(&quitting_for_setup);
                window.on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { api, .. } = event {
                        if !quitting_for_window.load(Ordering::SeqCst) {
                            api.prevent_close();
                            let _ = window_for_hide.hide();
                        }
                    }
                });
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("failed to build the desktop pet application");

    app.run(move |_app_handle, event| {
        if let RunEvent::ExitRequested { api, .. } = event {
            if !quitting.load(Ordering::SeqCst) {
                api.prevent_exit();
            }
        }
    });
}
