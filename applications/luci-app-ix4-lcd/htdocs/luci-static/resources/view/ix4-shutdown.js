'use strict';
'require view';
'require fs';
'require ui';

return view.extend({
	render: function() {
		var btn = E('button', {
			'class': 'btn cbi-button cbi-button-negative',
			'click': ui.createHandlerFn(this, function() {
				ui.showModal(_('Shutdown'), [
					E('p', {}, _('Are you sure you want to shut down the system?')),
					E('div', { 'class': 'right', 'style': 'display:flex; justify-content:flex-end; gap:8px; margin-top:12px;' }, [
						E('button', {
							'class': 'btn cbi-button',
							'click': ui.hideModal
						}, _('Cancel')),
						E('button', {
							'class': 'btn cbi-button-negative',
							'click': function() {
								ui.hideModal();
								ui.addNotification(null, E('p', _('Powering off system...')), 'warning');
								fs.exec('/sbin/poweroff').catch(function(err) {
									ui.addNotification(null, E('p', _('Shutdown failed: %s').format(err.message || err)), 'danger');
								});
							}
						}, _('Shut Down'))
					])
				]);
			})
		}, _('Perform shutdown'));

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', {}, _('Shutdown')),
			E('div', { 'class': 'cbi-map-descr' }, _('Shut down the operating system of your device')),
			E('div', { 'class': 'cbi-section' }, [
				E('div', { 'class': 'cbi-section-node' }, [
					E('div', { 'class': 'cbi-value' }, [
						E('div', { 'class': 'cbi-value-field' }, [ btn ])
					])
				])
			])
		]);
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
