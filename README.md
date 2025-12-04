# Gnome SHELL Shell Restarter

Simply an alternative to pressing <kbd>Alt</kbd>+<kbd>F2</kbd>+<kbd>R</kbd> (+ <kbd>Enter</kbd>).

_Might not work on Wayland - I really don't know_

## Features

*   **Panel Button:** A convenient button in your top bar to quickly restart GNOME Shell.
*   **Terminal Integration (DBus):** Trigger a shell restart directly from your terminal using a `gdbus` command.

## Supported GNOME Shell Versions

*   3.36, 3.38, 40, 42, 44, 45, 46

## Configuration

You can configure the extension's behavior through its preferences window:

*   **Show reload button in top bar:** Toggle the visibility of the restart button in the GNOME Shell panel. (Default: On)
*   **Register DBus interface:** Enable or disable the DBus interface that allows terminal-based restarts. (Default: On)
*   **Restart message:** Customize the message displayed when the shell restarts.
*   **DBus Command:** The preferences window also displays the exact `gdbus` command you can use to restart the shell from your terminal.

### Restarting from Terminal

If the "Register DBus interface" option is enabled in the preferences, you can restart the shell using the following command:

```bash
gdbus call --session \
  --dest org.gnome.Shell \
  --object-path /org/gnome/Shell/Extensions/ShellRestarter \
  --method org.gnome.Shell.Extensions.ShellRestarter.Restart
```
