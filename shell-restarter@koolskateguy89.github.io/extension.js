import GObject from 'gi://GObject';
import St from 'gi://St';
import Meta from 'gi://Meta';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

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

        this.button.connect('button-press-event', () => this._restart());

        this.add_child(this.button);
    }

    _restart() {
        const settings = this._extension.getSettings();
        const restartMessage = settings.get_string('restart-message') || "Restarting...";
        
        try {
            Meta.restart(restartMessage, global.context);
        } catch (_e) {
            Meta.restart(restartMessage);
        }
    }
});

export default class ShellRestarterExtension extends Extension {
    enable() {
        this._restartButton = new RestartButton(this);
        Main.panel.addToStatusArea('shell-restarter', this._restartButton);
    }

    disable() {
        this._restartButton.destroy();
        this._restartButton = null;
    }
}