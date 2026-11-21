'use strict';
'require view';
'require form';
'require fs';
'require rpc';
'require uci';
'require ui';
'require poll';

var _ = (typeof L !== 'undefined' && L.tr) ? L.tr.bind(L) : function(s) { return s; };

var FONT5X7 = [
[0x00,0x00,0x00,0x00,0x00],
[0x00,0x00,0x5f,0x00,0x00],
[0x00,0x07,0x00,0x07,0x00],
[0x14,0x7f,0x14,0x7f,0x14],
[0x24,0x2a,0x7f,0x2a,0x12],
[0x23,0x13,0x08,0x64,0x62],
[0x36,0x49,0x55,0x22,0x50],
[0x00,0x05,0x03,0x00,0x00],
[0x00,0x1c,0x22,0x41,0x00],
[0x00,0x41,0x22,0x1c,0x00],
[0x14,0x08,0x3e,0x08,0x14],
[0x08,0x08,0x3e,0x08,0x08],
[0x00,0x50,0x30,0x00,0x00],
[0x08,0x08,0x08,0x08,0x08],
[0x00,0x60,0x60,0x00,0x00],
[0x20,0x10,0x08,0x04,0x02],
[0x3e,0x51,0x49,0x45,0x3e],
[0x00,0x42,0x7f,0x40,0x00],
[0x42,0x61,0x51,0x49,0x46],
[0x21,0x41,0x45,0x4b,0x31],
[0x18,0x14,0x12,0x7f,0x10],
[0x27,0x45,0x45,0x45,0x39],
[0x3c,0x4a,0x49,0x49,0x30],
[0x01,0x71,0x09,0x05,0x03],
[0x36,0x49,0x49,0x49,0x36],
[0x06,0x49,0x49,0x29,0x1e],
[0x00,0x36,0x36,0x00,0x00],
[0x00,0x56,0x36,0x00,0x00],
[0x08,0x14,0x22,0x41,0x00],
[0x14,0x14,0x14,0x14,0x14],
[0x00,0x41,0x22,0x14,0x08],
[0x02,0x01,0x51,0x09,0x06],
[0x32,0x49,0x79,0x41,0x3e],
[0x7e,0x11,0x11,0x11,0x7e],
[0x7f,0x49,0x49,0x49,0x36],
[0x3e,0x41,0x41,0x41,0x22],
[0x7f,0x41,0x41,0x22,0x1c],
[0x7f,0x49,0x49,0x49,0x41],
[0x7f,0x09,0x09,0x09,0x01],
[0x3e,0x41,0x49,0x49,0x7a],
[0x7f,0x08,0x08,0x08,0x7f],
[0x00,0x41,0x7f,0x41,0x00],
[0x20,0x40,0x41,0x3f,0x01],
[0x7f,0x08,0x14,0x22,0x41],
[0x7f,0x40,0x40,0x40,0x40],
[0x7f,0x02,0x0c,0x02,0x7f],
[0x7f,0x04,0x08,0x10,0x7f],
[0x3e,0x41,0x41,0x41,0x3e],
[0x7f,0x09,0x09,0x09,0x06],
[0x3e,0x41,0x51,0x21,0x5e],
[0x7f,0x09,0x19,0x29,0x46],
[0x46,0x49,0x49,0x49,0x31],
[0x01,0x01,0x7f,0x01,0x01],
[0x3f,0x40,0x40,0x40,0x3f],
[0x1f,0x20,0x40,0x20,0x1f],
[0x3f,0x40,0x38,0x40,0x3f],
[0x63,0x14,0x08,0x14,0x63],
[0x07,0x08,0x70,0x08,0x07],
[0x61,0x51,0x49,0x45,0x43],
[0x00,0x7f,0x41,0x41,0x00],
[0x02,0x04,0x08,0x10,0x20],
[0x00,0x41,0x41,0x7f,0x00],
[0x04,0x02,0x01,0x02,0x04],
[0x40,0x40,0x40,0x40,0x40],
[0x00,0x01,0x02,0x04,0x00],
[0x20,0x54,0x54,0x54,0x78],
[0x7f,0x48,0x44,0x44,0x38],
[0x38,0x44,0x44,0x44,0x20],
[0x38,0x44,0x44,0x48,0x7f],
[0x38,0x54,0x54,0x54,0x18],
[0x08,0x7e,0x09,0x01,0x02],
[0x0c,0x52,0x52,0x52,0x3e],
[0x7f,0x08,0x04,0x04,0x78],
[0x00,0x44,0x7d,0x40,0x00],
[0x20,0x40,0x44,0x3d,0x00],
[0x7f,0x10,0x28,0x44,0x00],
[0x00,0x41,0x7f,0x40,0x00],
[0x7c,0x04,0x18,0x04,0x78],
[0x7c,0x08,0x04,0x04,0x78],
[0x38,0x44,0x44,0x44,0x38],
[0x7c,0x14,0x14,0x14,0x08],
[0x08,0x14,0x14,0x18,0x7c],
[0x7c,0x08,0x04,0x04,0x08],
[0x48,0x54,0x54,0x54,0x20],
[0x04,0x3f,0x44,0x40,0x20],
[0x3c,0x40,0x40,0x20,0x7c],
[0x1c,0x20,0x40,0x20,0x1c],
[0x3c,0x40,0x30,0x40,0x3c],
[0x44,0x28,0x10,0x28,0x44],
[0x0c,0x50,0x50,0x50,0x3c],
[0x44,0x64,0x54,0x4c,0x44]
];

return view.extend({
load: function() {
return Promise.all([
L.resolveDefault(fs.list('/etc/ix4-lcd'), []),
uci.load('ix4-lcd'),
L.resolveDefault(uci.load('system'), null)
]);
},

render: function(data) {
var bmps = data[0] || [];
var m, s, o, p, t, lv, pageNodes = [];
var bmpFiles = bmps.filter(function(f) {
return f.type === 'file' && f.name.match(/\.bmp$/i);
}).map(function(f) { return f.name; }).sort();

m = new form.Map('ix4-lcd', _('ix4-300d LCD Configuration'),
_('Configure the 128x64 front-panel ST7565 LCD and preview pages live.'));

/* ---- Tabbed General / Live View Section ---- */
s = m.section(form.NamedSection, 'general', 'general');
s.addremove = false;
s.tab('live', _('Live View'));
		s.tab('settings', _('Settings'));
s.renderContents = function(data) {
var res = form.NamedSection.prototype.renderContents.apply(this, arguments);
var tabLis = res.querySelectorAll('.cbi-tabmenu > li[data-tab]');
tabLis.forEach(function(li) {
li.addEventListener('click', function() {
try { sessionStorage.setItem('ix4_lcd_main_tab', li.getAttribute('data-tab') || 'live'); } catch (e) {}
});
});
try {
var savedMain = sessionStorage.getItem('ix4_lcd_main_tab');
if (savedMain) {
var targetLi = res.querySelector('.cbi-tabmenu > li[data-tab="' + savedMain + '"] > a');
if (targetLi) setTimeout(function() { targetLi.click(); }, 0);
}
} catch (e) {}
var pane = res.querySelector('[data-tab="settings"]');
if (pane) {
var vals = Array.prototype.slice.call(pane.children).filter(function(el) {
return el.classList && el.classList.contains('cbi-value');
});
if (vals.length >= 11) {
var grid = E('div', { style: 'display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:0 24px;' }, [
E('div', {}, vals.slice(0, 5)),
E('div', {}, vals.slice(5, 10))
]);
pane.appendChild(grid);
}
}
return res;
};
o = s.taboption('settings', form.Flag, 'enabled', _('Enable LCD Daemon'));
o.default = '1'; o.rmempty = false;

o = s.taboption('settings', form.Value, 'default_page', _('Startup Page (1..N)'));
o.datatype = 'range(1,16)'; o.default = '1';

o = s.taboption('settings', form.ListValue, 'backlight', _('Backlight Brightness'));
o.value('0', _('Off (0)'));
o.value('1', _('Low (1)'));
o.value('2', _('Medium (2)'));
o.value('3', _('High - Default (3)'));
o.default = '3';

o = s.taboption('settings', form.ListValue, 'invert', _('Display Polarity'));
o.value('1', _('Positive (Dark text on bright background)'));
o.value('0', _('Negative (Bright text on dark background)'));
o.default = '1';

o = s.taboption('settings', form.Value, 'contrast', _('Contrast'));
o.value('28', _('Light (28)'));
o.value('34', _('Soft (34)'));
o.value('38', _('Normal - Default (38)'));
o.value('42', _('Crisp (42)'));
o.value('48', _('High (48)'));
o.datatype = 'range(0,63)'; o.default = '38';

o = s.taboption('settings', form.Value, 'refresh', _('Refresh Interval (seconds)'));
o.datatype = 'min(1)'; o.default = '5';

o = s.taboption('settings', form.Flag, 'auto_scroll', _('Auto-Cycle Pages at Boot'));
o.default = '0';

o = s.taboption('settings', form.Value, 'marquee_ms', _('Marquee Scroll Step (ms)'));
o.datatype = 'min(100)'; o.default = '400';

o = s.taboption('settings', form.Flag, 'save_buttons', _('Save Front-Panel Button Toggles'));
o.default = '1';

o = s.taboption('settings', form.Button, '_upload_bmp', _('Upload 128x64 1-bit .bmp'));
o.inputtitle = _('Upload BMP...');
o.inputstyle = 'action';
o.onclick = function(ev) {
var tmpPath = '/tmp/ix4-lcd-upload.bmp';
return ui.uploadFile(tmpPath, ev.target).then(function(res) {
var name = (res && res.name) ? res.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'custom.bmp';
if (!name.match(/\.bmp$/i)) name += '.bmp';
return fs.exec('/bin/mv', [tmpPath, '/etc/ix4-lcd/' + name]).then(function() {
ui.addNotification(null, E('p', _('Uploaded %s to /etc/ix4-lcd/').format(name)), 'info');
window.location.reload();
});
}).catch(function(e) {
ui.addNotification(null, E('p', _('Upload failed: %s').format(e.message || e)), 'danger');
});
};

/* ---- Tab 2: Live View 128x64 Simulator ---- */
lv = s.taboption('live', form.DummyValue, '_live_canvas');
lv.render = function() {
var curPg = 0, tick = 0, bmpCache = {}, liveStats = {};
var canvas = E('canvas', {
width: 384, height: 192,
style: 'position:absolute; left:155px; top:44px; width:430px; height:192px; border:none; border-radius:3px; background:#7ec8ff; display:block; image-rendering:pixelated;'
});
var pageSel = E('select', { class: 'cbi-input-select', style: 'margin-right:8px;' });
var prevBtn = E('button', { class: 'btn cbi-button', type: 'button', style: 'margin-right:6px;' }, _('Prev Page'));
var nextBtn = E('button', { class: 'btn cbi-button', type: 'button', style: 'margin-right:12px;' }, _('Next Page'));
var infoSpan = E('span', { style: 'font-family:monospace; color:#666;' }, '');

function getPages() {
var secs = (m.data && m.data.sections) ? m.data.sections('ix4-lcd', 'page') : uci.sections('ix4-lcd', 'page');
if (secs && secs.length) {
return secs.map(function(sec) {
var sid = sec['.name'];
var getVal = function(opt, fb) {
var el = document.querySelector('[name="cbid.ix4-lcd.' + sid + '.' + opt + '"]');
if (!el) return (fb || '');
return (el.type === 'checkbox') ? (el.checked ? '1' : '0') : (el.value || '');
};
var obj = { bmp: getVal('bmp', sec.bmp), bmp_invert: getVal('bmp_invert', sec.bmp_invert) };
for (var r = 0; r < 8; r++) obj['row' + r] = getVal('row' + r, sec['row' + r]);
return obj;
});
}
return [{ row0: '{hostname} {page}{auto}', row2: 'IP: {ip}', row3: 'Up: {uptime}' }];
}

function expandSample(tpl, pgIdx, total) {
var now = new Date();
var pad = function(n) { return (n < 10 ? '0' : '') + n; };
var map = Object.assign({
page: (pgIdx + 1) + '/' + total, auto: '*',
date: now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()),
time: pad(now.getHours()) + ':' + pad(now.getMinutes()),
time_sec: pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()),
uptime: '4h 12m', hostname: uci.get('system', '@system', 'hostname') || 'OpenWrt', kernel: '6.18.10',
ram: '48/512 MB', load: '0.12 0.08 0.05', cpu_load: ' 12',
cpu_temp: '43', soc_temp: '45', board_temp: '33', bay_temp: '31', fan: ' 827',
ip: window.location.hostname || '192.168.5.12', eth0: 'up', eth1: 'down',
eth0_ip: window.location.hostname || '192.168.5.12', eth1_ip: 'None',
eth0_speed: '1000M', eth1_speed: 'down', rx_rate: '124K', tx_rate: '85K',
sata: '1234', raid: 'md0:active', flash: '12.4M/980M (1%)',
mnt_used: '1.2T/3.6T (33%)', mnt_free: '2.4T',
hdd1_temp: '34C', hdd2_temp: '35C', hdd3_temp: '33C', hdd4_temp: '36C', smb_clients: '1'
}, liveStats);
return (tpl || '').replace(/\{([a-zA-Z0-9_]+)\}/g, function(_, k) {
return (k in map) ? map[k] : '[' + k + ']';
}).replace(/\$\([^)]+\)/g, '[cmd]');
}

function draw() {
var pages = getPages();
var hasRealSecs = (m.data && m.data.sections && m.data.sections('ix4-lcd', 'page').length > 0) || (uci.sections('ix4-lcd', 'page').length > 0);
if (hasRealSecs) {
try {
var sp = parseInt(sessionStorage.getItem('ix4_lcd_emu_pg'), 10);
if (!isNaN(sp) && sp >= 0 && sp < pages.length) curPg = sp;
} catch (e) {}
}
if (pageSel.options.length !== pages.length) {
pageSel.innerHTML = '';
pages.forEach(function(pgItem, i) {
pageSel.appendChild(E('option', { value: String(i) }, _('Page %d / %d').format(i + 1, pages.length)));
});
}
var showPg = (curPg < pages.length) ? curPg : 0;
pageSel.value = String(showPg);
var pg = pages[showPg];

var invEl = document.querySelector('[name="cbid.ix4-lcd.general.invert"]');
var blEl = document.querySelector('[name="cbid.ix4-lcd.general.backlight"]');
var inv = (invEl ? invEl.value : (uci.get('ix4-lcd', 'general', 'invert') || '1')) === '1';
var bl = parseInt(blEl ? blEl.value : (uci.get('ix4-lcd', 'general', 'backlight') || '3'), 10);
var bgColors = ['#18222a', '#355c7d', '#5c9cd6', '#7ec8ff'];
var bg = inv ? bgColors[bl & 3] : '#0b192c';
var fg = inv ? '#0b192c' : (bl === 0 ? '#2b3e50' : '#8ce0ff');

var ctx = canvas.getContext('2d');
ctx.fillStyle = bg; ctx.fillRect(0, 0, 384, 192); ctx.fillStyle = fg;

if (pg.bmp) {
var bname = pg.bmp.indexOf('/') === 0 ? pg.bmp : '/etc/ix4-lcd/' + pg.bmp;
if (!(bname in bmpCache)) {
bmpCache[bname] = null;
fs.read_direct(bname, 'blob').then(function(blob) { return blob.arrayBuffer(); }).then(function(ab) {
bmpCache[bname] = new Uint8Array(ab); draw();
}).catch(function() {});
}
var raw = bmpCache[bname];
if (raw && raw.length >= 1086 && raw[0] === 66 && raw[1] === 77) {
var off = raw[10] | (raw[11] << 8) | (raw[12] << 16) | (raw[13] << 24);
var pal0Dark = (raw[54] + raw[55] + raw[56]) < (raw[58] + raw[59] + raw[60]);
var binv = (pg.bmp_invert === '1');
for (var y = 0; y < 64; y++) {
var sy = 63 - y;
for (var x = 0; x < 128; x++) {
var bit = (raw[off + sy * 16 + (x >> 3)] >> (7 - (x & 7))) & 1;
var ink = pal0Dark ? !bit : bit;
if (binv) ink = !ink;
if (ink) ctx.fillRect(x * 3, y * 3, 3, 3);
}
}
}
}

for (var r = 0; r < 8; r++) {
var txt = expandSample(pg['row' + r] || '', showPg, pages.length);
if (!txt) continue;
var disp = txt;
if (txt.length > 21) {
var span = txt.length + 3;
var off = (tick <= 3) ? 0 : ((tick - 3) % span);
disp = (txt + '   ' + txt).slice(off, off + 21);
}
var col = 0;
for (var i = 0; i < disp.length && col <= 122; i++) {
var code = disp.charCodeAt(i);
var glyph = (code >= 32 && code <= 122) ? FONT5X7[code - 32] : FONT5X7[0];
ctx.fillStyle = bg; ctx.fillRect(col * 3, r * 24, 18, 24); ctx.fillStyle = fg;
for (var c = 0; c < 5; c++) {
var bits = glyph[c];
for (var b = 0; b < 7; b++) {
if ((bits >> b) & 1) ctx.fillRect((col + c) * 3, (r * 8 + b) * 3, 3, 3);
}
}
col += 6;
}
}
infoSpan.textContent = _('128x64 px (3x zoom) | Polarity: %s | Backlight: %d/3').format(inv ? 'Positive' : 'Negative', bl);
}

pageSel.addEventListener('change', function() { curPg = parseInt(pageSel.value, 10) || 0; tick = 0; draw(); });
prevBtn.addEventListener('click', function() { var n = getPages().length; curPg = (curPg + n - 1) % n; tick = 0; draw(); });
nextBtn.addEventListener('click', function() { var n = getPages().length; curPg = (curPg + 1) % n; tick = 0; draw(); });
draw();
setInterval(function() { if (document.body.contains(canvas)) { tick++; draw(); } }, 450);

var bezelWrap = E('div', {
style: 'position:relative; width:820px; height:314px; margin:10px auto; border-radius:14px; box-shadow:0 6px 20px rgba(0,0,0,0.45); flex-shrink:0;'
});
bezelWrap.innerHTML = '<svg viewBox="0 0 820 314" width="820" height="314" style="display:block;"><defs><linearGradient id="ix4_body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#35373b"/><stop offset="50%" stop-color="#232528"/><stop offset="100%" stop-color="#17181a"/></linearGradient><linearGradient id="ix4_trim" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#7c8087"/><stop offset="50%" stop-color="#b4b8bf"/><stop offset="100%" stop-color="#6d7178"/></linearGradient></defs><rect x="2" y="2" width="816" height="310" rx="14" fill="url(#ix4_body)" stroke="#4a4d52" stroke-width="2"/><rect x="18" y="18" width="784" height="278" rx="10" fill="#1b1c1f" stroke="#3c3f44" stroke-width="1.5"/><rect x="24" y="24" width="772" height="2" fill="url(#ix4_trim)" opacity="0.5"/><!-- Recessed LCD Bezel Window (430x192 at x=155, y=44) --><rect x="145" y="34" width="450" height="212" rx="8" fill="#101113" stroke="#555960" stroke-width="2"/><rect x="151" y="40" width="438" height="200" rx="5" fill="#090a0b" stroke="#2b2d31" stroke-width="1.5"/><!-- Left Status Indicators --><circle id="ix4_led_sys" cx="82" cy="78" r="5" fill="#2a2d34" stroke="#454952" stroke-width="1"/><text x="82" y="96" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">SYS</text><circle id="ix4_led_hdd" cx="82" cy="128" r="5" fill="#2a2d34" stroke="#454952" stroke-width="1"/><text x="82" y="145" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">HDD</text><circle id="ix4_led_pwr" cx="82" cy="176" r="5" fill="#ffffff" stroke="#454952" stroke-width="1"/><text x="82" y="194" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">POWER</text><!-- Right Select & Scroll Buttons --><g id="ix4_btn_prev" style="cursor:pointer;"><rect x="616" y="64" width="38" height="58" rx="6" fill="#2c2f34" stroke="#6c7077" stroke-width="1.5"/><polygon points="635,84 627,98 643,98" fill="#cfd3da"/><text x="635" y="135" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">SELECT</text></g><g id="ix4_btn_next" style="cursor:pointer;"><rect x="616" y="156" width="38" height="58" rx="6" fill="#2c2f34" stroke="#6c7077" stroke-width="1.5"/><polygon points="635,194 627,180 643,180" fill="#cfd3da"/><text x="635" y="227" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">SCROLL</text></g><!-- Lenovo / ix4-300d Branding --><text x="732" y="102" fill="#d0d4dc" font-family="sans-serif" font-weight="bold" font-style="italic" font-size="22" text-anchor="middle" letter-spacing="0.5">lenovo</text><text x="732" y="122" fill="#7c818a" font-family="sans-serif" font-size="11" text-anchor="middle" letter-spacing="1">ix4-300d</text><g id="ix4_btn_pwr" style="cursor:pointer;"><title>Power Options (Reboot / Power Off)</title><circle cx="732" cy="184" r="18" fill="#2c2f34" stroke="#6c7077" stroke-width="1.5"/><path d="M 732 174 L 732 183 M 726 178 A 8 8 0 1 0 738 178" fill="none" stroke="#cfd3da" stroke-width="1.8" stroke-linecap="round"/><text x="732" y="216" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">POWER</text></g><!-- Bottom Pseudo-LEDs (ETH0 / ETH1) --><circle id="ix4_led_eth0" cx="325" cy="268" r="5" fill="#ef4444" stroke="#454952" stroke-width="1"/><text x="325" y="285" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">ETH0</text><circle id="ix4_led_eth1" cx="415" cy="268" r="5" fill="#ef4444" stroke="#454952" stroke-width="1"/><text x="415" y="285" fill="#9aa0a6" font-family="sans-serif" font-size="9" text-anchor="middle">ETH1</text></svg>';
bezelWrap.appendChild(canvas);
var bPrev = bezelWrap.querySelector('#ix4_btn_prev');
var bNext = bezelWrap.querySelector('#ix4_btn_next');
var callLcdSig = rpc.declare({ object: 'service', method: 'signal', params: ['name', 'signal'] });
if (bPrev) bPrev.addEventListener('click', function() {
nextBtn.click();
L.resolveDefault(callLcdSig('ix4-lcd', 10), null);
});
if (bNext) bNext.addEventListener('click', function() {
var blEl = document.querySelector('[name="cbid.ix4-lcd.general.backlight"]');
var curBl = parseInt(blEl ? blEl.value : (uci.get('ix4-lcd', 'general', 'backlight') || '3'), 10);
var nxtBl = String((curBl + 1) & 3);
if (blEl) blEl.value = nxtBl;
uci.set('ix4-lcd', 'general', 'backlight', nxtBl);
draw();
L.resolveDefault(callLcdSig('ix4-lcd', 12), null);
});
var bPwr = bezelWrap.querySelector('#ix4_btn_pwr');
if (bPwr) bPwr.addEventListener('click', function() {
ui.showModal(_('System Power'), [
E('p', {}, _('Select an action for the Lenovo Iomega ix4-300d:')),
E('div', { class: 'right', style: 'display:flex; justify-content:flex-end; gap:8px; margin-top:12px;' }, [
E('button', {
class: 'btn cbi-button',
type: 'button',
click: ui.hideModal
}, _('Cancel')),
E('button', {
class: 'btn cbi-button-action',
type: 'button',
click: function() {
ui.hideModal();
ui.addNotification(null, E('p', _('Rebooting system...')), 'info');
fs.exec('/sbin/reboot').catch(function(err) {
ui.addNotification(null, E('p', _('Reboot failed: %s').format(err.message || err)), 'danger');
});
}
}, _('Reboot')),
E('button', {
class: 'btn cbi-button-negative',
type: 'button',
click: function() {
ui.hideModal();
ui.addNotification(null, E('p', _('Powering off system...')), 'warning');
fs.exec('/sbin/poweroff').catch(function(err) {
ui.addNotification(null, E('p', _('Power off failed: %s').format(err.message || err)), 'danger');
});
}
}, _('Power Off'))
])
]);
});
function pollLeds() {
if (!document.body.contains(bezelWrap)) return;
var callNetDump = rpc.declare({ object: 'network.interface', method: 'dump', expect: { 'interface': [] } });
var setLed = function(id, color) {
var el = bezelWrap.querySelector('#' + id);
if (!el) return;
el.setAttribute('fill', color || '#2a2d34');
el.style.filter = color ? ('drop-shadow(0 0 5px ' + color + ')') : 'none';
};
var setDisconnected = function() {
['ix4_led_sys', 'ix4_led_hdd', 'ix4_led_pwr', 'ix4_led_eth0', 'ix4_led_eth1'].forEach(function(id) {
setLed(id, null);
});
};
var paths = [
'/sys/class/leds/ix4-300d:sys:blue/brightness',
'/sys/class/leds/ix4-300d:sysfail:red/brightness',
'/sys/class/leds/ix4-300d:hdd:blue/brightness',
'/sys/class/leds/ix4-300d:hddfail:red/brightness',
'/sys/class/leds/ix4-300d:power:white/brightness',
'/sys/devices/platform/soc/soc:internal-regs/f1070000.ethernet/net/eth0/carrier',
'/sys/devices/platform/soc/soc:internal-regs/f1074000.ethernet/net/eth1/carrier'
];
var timer = setTimeout(setDisconnected, 1800);
Promise.all(paths.map(function(p) { return fs.read(p); }).concat([callNetDump()])).then(function(v) {
clearTimeout(timer);
var on = function(s) { return parseInt((s || '').trim(), 10) > 0; };
setLed('ix4_led_sys', on(v.at(1)) ? '#ef4444' : (on(v.at(0)) ? '#3b82f6' : null));
setLed('ix4_led_hdd', on(v.at(3)) ? '#ef4444' : (on(v.at(2)) ? '#3b82f6' : null));
setLed('ix4_led_pwr', on(v.at(4)) ? '#ffffff' : null);

var ifaces = v.at(7) || [];
var hasRouterLink = function(dev) {
return ifaces.some(function(ifc) {
if (!ifc || !ifc.up) return false;
var l3 = ifc.l3_device || '', d = ifc.device || '';
var match = (d === dev || l3 === dev || (l3 === 'br-lan' && (ifc['interface'] === 'lan' || d === 'br-lan')));
if (!match) return false;
var hasIp = Array.isArray(ifc['ipv4-address']) && ifc['ipv4-address'].length > 0;
var hasRt = Array.isArray(ifc.route) && ifc.route.length > 0;
return hasIp || hasRt;
});
};
var ethColor = function(carrier, dev) {
if (!on(carrier)) return '#ef4444';
return hasRouterLink(dev) ? '#22c55e' : '#f59e0b';
};
setLed('ix4_led_eth0', ethColor(v.at(5), 'eth0'));
setLed('ix4_led_eth1', ethColor(v.at(6), 'eth1'));
}).catch(function() {
clearTimeout(timer);
setDisconnected();
});
}
pollLeds();
setInterval(pollLeds, 2000);
var bezelScroll = E('div', {
style: 'width:100%; overflow-x:auto; display:flex; justify-content:center;'
}, [ bezelWrap ]);
return E('div', { class: 'cbi-value', style: 'display:flex; flex-direction:column; align-items:center; text-align:center;' }, [
E('div', { style: 'margin-bottom:8px; display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:6px;' }, [ pageSel, prevBtn, nextBtn, infoSpan ]),
bezelScroll,
E('div', { class: 'cbi-value-description', style: 'margin-top:6px; text-align:center;' }, _('Live simulator updates automatically as you edit pages, rows, polarity, or backlight in Settings.'))
]);
};

p = m.section(form.TypedSection, 'page', _('Display Pages (1 to 16)'));
		p.addremove = true; p.anonymous = true; p.sortable = true; p.maxrows = 16;

p.renderContents = function(data) {
return Promise.resolve(form.TypedSection.prototype.renderContents.apply(this, arguments)).then(function(res) {
var nodes = Array.prototype.slice.call(res.querySelectorAll('.cbi-section-node'));
if (!nodes.length) return res;
var tabBar = E('ul', { class: 'cbi-tabmenu', style: 'margin-bottom:10px;' });
var tabs = [], delBars = [];
var addBox = res.querySelector('.cbi-section-create');
if (addBox) {
addBox.style.display = 'flex'; addBox.style.justifyContent = 'flex-end'; addBox.style.alignItems = 'center'; addBox.style.gap = '8px';
addBox.querySelectorAll('button, .btn').forEach(function(b) { b.style.flex = '0 0 110px'; b.style.width = '110px'; b.style.margin = '0'; });
}

function selectPageTab(idx, syncEmu) {
try { sessionStorage.setItem('ix4_lcd_page_tab', String(idx)); } catch (e) {}
tabs.forEach(function(li, i) {
li.className = (i === idx) ? 'cbi-tab' : 'cbi-tab-disabled';
});
nodes.forEach(function(node, i) {
node.style.display = (i === idx) ? '' : 'none';
});
delBars.forEach(function(bar, i) {
bar.style.display = (i === idx) ? 'inline-block' : 'none';
});
if (syncEmu) {
var sel = document.querySelector('#cbi-ix4-lcd-general select.cbi-input-select');
if (sel && sel.options.length > idx) {
sel.value = String(idx);
sel.dispatchEvent(new Event('change'));
}
}
}

nodes.forEach(function(node, idx) {
var prev = node.previousElementSibling;
if (prev && prev.classList && (prev.classList.contains('cbi-section-remove') || prev.classList.contains('cbi-section-actions'))) {
prev.style.display = 'none';
prev.style.marginLeft = '0'; prev.querySelectorAll('button, .btn').forEach(function(b) { b.style.flex = '0 0 110px'; b.style.width = '110px'; b.style.margin = '0'; });
prev.style.verticalAlign = 'middle';
if (addBox) addBox.appendChild(prev);
delBars.push(prev);
}
var vals = Array.prototype.slice.call(node.children).filter(function(el) {
return el.classList && el.classList.contains('cbi-value');
});
if (vals.length >= 11) {
vals.forEach(function(v) {
v.style.display = 'flex';
v.style.alignItems = 'center';
v.style.marginBottom = '6px';
var lbl = v.querySelector('.cbi-value-title');
var fld = v.querySelector('.cbi-value-field');
if (lbl) { lbl.style.width = '145px'; lbl.style.minWidth = '145px'; lbl.style.textAlign = 'left'; lbl.style.paddingRight = '8px'; }
if (fld) { fld.style.flex = '1'; fld.style.marginLeft = '0'; }
});
var topRow = E('div', { style: 'display:grid; grid-template-columns:2fr 1fr 1fr; gap:0 16px;' }, [ vals[0], vals[1], vals[2] ]);
var rowsGrid = E('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap:0 24px;' }, [
E('div', {}, vals.slice(3, 7)),
E('div', {}, vals.slice(7, 11))
]);
node.appendChild(topRow);
node.appendChild(rowsGrid);
}
var a = E('a', { href: '#' }, _('Page %d').format(idx + 1));
a.addEventListener('click', function(ev) { ev.preventDefault(); selectPageTab(idx, true); });
var li = E('li', { class: (idx === 0) ? 'cbi-tab' : 'cbi-tab-disabled' }, a);
tabs.push(li);
tabBar.appendChild(li);
});

nodes[0].parentNode.insertBefore(tabBar, nodes[0]);
var initIdx = 0;
try {
var savedPg = parseInt(sessionStorage.getItem('ix4_lcd_page_tab'), 10);
if (!isNaN(savedPg) && savedPg >= 0 && savedPg < nodes.length) initIdx = savedPg;
} catch (e) {}
selectPageTab(initIdx, false);
return res;
});
};

o = p.option(form.Value, 'bmp', _('Background BMP'));
o.optional = true;
o.placeholder = _('None');
bmpFiles.forEach(function(fn) { o.value(fn, fn); });

o = p.option(form.Flag, 'bmp_invert', _('Invert BMP Pixels'));
o.default = '0';

o = p.option(form.Flag, 'hide', _('Hide Page'));
o.default = '0';

for (var r = 0; r < 8; r++) {
o = p.option(form.Value, 'row' + r, _('Row %d').format(r));
o.optional = true;
o.placeholder = (r === 0) ? '{hostname} {page}{auto}' : '';
}

/* ---- Custom Tokens Section ---- */
t = m.section(form.TableSection, 'token', _('Custom Tokens'),
_('Reusable {name} tokens from a sysfs/proc file or shell command (up to 32).'));
t.addremove = true;
t.anonymous = true;
t.render = function() {
return Promise.resolve(form.TableSection.prototype.render.apply(this, arguments)).then(function(el) {
var addBox = el.querySelector('.cbi-section-create');
if (addBox) {
addBox.style.display = 'flex';
addBox.style.alignItems = 'center';
addBox.style.gap = '16px';
addBox.querySelectorAll('button, .btn').forEach(function(b) {
b.style.flex = '0 0 110px';
b.style.width = '110px';
b.style.margin = '0';
});
addBox.appendChild(E('div', {
class: 'cbi-section-descr',
style: 'flex:1; font-size:0.82em; font-family:monospace; background:transparent; border:none; padding:0; margin:0; line-height:1.35;'
}, _('Tokens: {page} {auto} {date} {time} {time_sec} {uptime} {hostname} {kernel} | {ram} {load} {cpu_temp} {soc_temp} {board_temp} {bay_temp} {fan} | {ip} {eth0} {eth1} {eth0_ip} {eth1_ip} {eth0_speed} {eth1_speed} {rx_rate} {tx_rate} | {sata} {raid} {flash} {mnt_used} {mnt_free} {hdd1_temp}..{hdd4_temp} {smb_clients} | $(cmd)')));
}
return el;
});
};

o = t.option(form.Value, 'name', _('Name')); o.datatype = 'uciname'; o.placeholder = 'wan_ip';
o = t.option(form.Value, 'file', _('File Path')); o.optional = true; o.placeholder = '/sys/class/thermal/thermal_zone0/temp';
o = t.option(form.Value, 'div', _('Divisor')); o.datatype = 'uinteger'; o.optional = true; o.placeholder = '1000';
o = t.option(form.Value, 'cmd', _('Command')); o.optional = true; o.placeholder = 'uname -r';
o = t.option(form.Value, 'ttl', _('TTL (s)')); o.datatype = 'uinteger'; o.optional = true; o.placeholder = '60';

return m.render();
}
});
