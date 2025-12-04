import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ShellRestarterPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();

        // General Settings Group
        const generalGroup = new Adw.PreferencesGroup({
            title: 'General',
        });

        // Show Indicator Switch
        const showIndicatorRow = new Adw.SwitchRow({
            title: 'Show reload button',
            subtitle: 'Display the restart button in the top bar',
        });
        settings.bind('show-indicator', showIndicatorRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        generalGroup.add(showIndicatorRow);

        // DBus Interface Switch
        const enableDbusRow = new Adw.SwitchRow({
            title: 'Enable DBus interface',
            subtitle: 'Allow triggering restart via DBus/Terminal',
        });
        settings.bind('enable-dbus', enableDbusRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        generalGroup.add(enableDbusRow);

        page.add(generalGroup);

        // Command Line Usage Group
        const commandGroup = new Adw.PreferencesGroup({
            title: 'Command Line Usage',
            description: 'The DBus command to trigger a shell restart from the terminal. You can copy this text directly.',
        });
        settings.bind('enable-dbus', commandGroup, 'sensitive', Gio.SettingsBindFlags.DEFAULT);

        const commandText = 'gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/ShellRestarter --method org.gnome.Shell.Extensions.ShellRestarter.Restart';

        const commandRow = new Adw.EntryRow({
            title: 'DBus Command',
            text: commandText,
            editable: false
        });

        // The user can select and copy the text directly from the EntryRow
        commandGroup.add(commandRow);
        page.add(commandGroup);

        // Message Settings Group
        const messageGroup = new Adw.PreferencesGroup({
            title: 'Message',
            description: 'Customize the message shown before the shell restarts.',
        });

        const entryRow = new Adw.EntryRow({
            title: 'Restart message',
            text: settings.get_string('restart-message'),
        });
        settings.bind('restart-message', entryRow, 'text', Gio.SettingsBindFlags.DEFAULT);

        const resetButton = new Gtk.Button({ label: 'Reset to default' });
        if (resetButton.add_css_class) {
            resetButton.add_css_class('flat');
        }
        resetButton.connect('clicked', () => settings.reset('restart-message'));
        entryRow.add_suffix(resetButton);

        messageGroup.add(entryRow);
        page.add(messageGroup);

        window.add(page);
    }
}
