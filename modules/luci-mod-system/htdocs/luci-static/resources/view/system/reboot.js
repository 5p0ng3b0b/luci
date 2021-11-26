'use strict';
'require view';
'require rpc';
'require ui';
'require uci';

var callReboot = rpc.declare({
	object: 'system',
	method: 'reboot',
	expect: { result: 0 }
});

return view.extend({
	load: function() {
		return uci.changes();
	},

	render: function(changes) {
		var body = E([
			E('h2', _('Reboot / Power Off')),
			E('p', {}, _('Reboot or power off the operating system of your device'))
		]);

		for (var config in (changes || {})) {
			body.appendChild(E('p', { 'class': 'alert-message warning' },
				_('Warning: There are unsaved changes that will get lost on reboot!')));
			break;
		}

		body.appendChild(E('hr'));
		body.appendChild(E('button', {
			'class': 'cbi-button cbi-button-action important',
			'click': ui.createHandlerFn(this, 'handleReboot')
		}, _('Perform reboot')));

		body.appendChild(E('hr'));
		body.appendChild(E('button', {
			'class': 'btn cbi-button cbi-button-apply important',
			'click': ui.createHandlerFn(this, 'handlePowerOff')
		}, _('Perform power off...'))

			: E('p', { 'class' : 'alert-message warning'},
			_('Warning: This system does not support powering off!'))
		);
		return body;
	},

	handleReboot: function(ev) {
		return callReboot().then(function(res) {
			if (res != 0) {
				L.ui.addNotification(null, E('p', _('The reboot command failed with code %d').format(res)));
				L.raise('Error', 'Reboot failed');
			}

			L.ui.showModal(_('Rebooting…'), [
				E('p', { 'class': 'spinning' }, _('Waiting for device...'))
			]);

			window.setTimeout(function() {
				L.ui.showModal(_('Rebooting…'), [
					E('p', { 'class': 'spinning alert-message warning' },
						_('Device unreachable! Still waiting for device...'))
				]);
			}, 150000);

			L.ui.awaitReconnect();
		})
		.catch(function(e) { L.ui.addNotification(null, E('p', e.message)) });
	},

	callPowerOff: function() {
		return fs.exec('/sbin/poweroff').then(function() {
			ui.showModal(_('Shutting down...'), [
				E('p', { 'class': 'spinning' }, _('The system is shutting down now.<br /> DO NOT POWER OFF THE DEVICE!<br /> It might be necessary to renew the address of your computer to reach the device again, depending on your settings.'))
			]);
		})
	},

	handlePowerOff: function() {

		ui.showModal(_('Power Off Device'), [
			E('p', _("WARNING: Power off might result in a reboot on a device which doesn't support power off.<br /><br />\
			Click \"Proceed\" below to power off your device.")),
			E('div', { 'class': 'right' }, [
				E('button', {
					'class': 'btn',
					'click': ui.hideModal
				}, _('Cancel')), ' ',
				E('button', {
					'class': 'btn cbi-button cbi-button-positive important',
					'click': L.bind(this.callPowerOff, this)
				}, _('Proceed'))
			])
		]);

	},
	
	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
