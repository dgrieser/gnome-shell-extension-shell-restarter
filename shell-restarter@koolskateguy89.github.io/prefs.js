import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ShellRestarterPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: 'Shell Restarter',
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

        group.add(entryRow);
        page.add(group);
        window.add(page);
    }
}