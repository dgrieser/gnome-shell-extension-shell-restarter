import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import St from 'gi://St';
import Meta from 'gi://Meta';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const ShellRestarterInterface = `
<node>
  <interface name="org.gnome.Shell.Extensions.ShellRestarter">
    <method name="Restart">
    </method>
  </interface>
</node>`;

const RestartButton = GObject.registerClass(
class RestartButton extends PanelMenu.Button {
    _init(extension) {
        super._init(0.0, 'Shell Restarter');
        this._extension = extension;

        this.button = new St.Icon({
            icon_name : 'view-refresh-symbolic',
            style_class : 'system-status-icon',
            reactive: true,
        });

        this.button.connect('button-press-event', () => this._extension.restartShell());

        this.add_child(this.button);
    }
});

export default class ShellRestarterExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        
        this._settingsChangedId = this._settings.connect('changed', this._syncState.bind(this));
        
        this._syncState();
    }

    disable() {
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        this._removeButton();
        this._removeDBus();
        
        this._settings = null;
    }

    _syncState() {
        // Button handling
        if (this._settings.get_boolean('show-indicator')) {
            if (!this._restartButton) {
                this._restartButton = new RestartButton(this);
                Main.panel.addToStatusArea('shell-restarter', this._restartButton);
            }
        } else {
            this._removeButton();
        }

        // DBus handling
        if (this._settings.get_boolean('enable-dbus')) {
            if (!this._dbusImpl) {
                this._dbusImpl = Gio.DBusExportedObject.wrapJSObject(ShellRestarterInterface, this);
                this._dbusImpl.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/ShellRestarter');
            }
        } else {
            this._removeDBus();
        }
    }

    _removeButton() {
        if (this._restartButton) {
            this._restartButton.destroy();
            this._restartButton = null;
        }
    }

    _removeDBus() {
        if (this._dbusImpl) {
            this._dbusImpl.unexport();
            this._dbusImpl = null;
        }
    }

    Restart() {
        this.restartShell();
    }

    restartShell() {
        const restartMessage = this._settings.get_string('restart-message') || "Restarting...";
        
        try {
            Meta.restart(restartMessage, global.context);
        } catch (_e) {
            Meta.restart(restartMessage);
        }
    }
}