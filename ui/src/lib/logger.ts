// Browser devtools logger — dev only
//
//   relog()            → prints table of all groups + current status
//   setlog("feed,auth")          → toggle on (status 1, default)
//   setlog("feed", 2)            → only these, disable rest
//   setlog("spam,noise", 3)      → reject/disable these
//   setlog("", 0)                → reset: all on
//   logger("feed")               → get logger in component code
//
// By default: all groups active (show everything).

type LogFn = (...args: unknown[]) => void;

interface Logger {
	info: LogFn;
	warn: LogFn;
	error: LogFn;
	debug: LogFn;
	group(label: string): void;
	groupEnd(): void;
}

const groups = new Map<string, boolean>();

function relog() {
	const rows = [...groups.entries()].map(([name, on]) => ({
		group: name,
		status: on ? '✅ on' : '❌ off',
	}));
	console.table(rows);
	console.log(
		'%csetlog("x,y")%c toggle  |  %csetlog("x",2)%c only  |  %csetlog("x",3)%c reject  |  %csetlog("",0)%c reset',
		'color:#60a5fa', '', 'color:#f59e0b', '', 'color:#ef4444', '', 'color:#9ca3af', ''
	);
}

function setlog(spec: string, mode: 0 | 1 | 2 | 3 = 1) {
	const names = spec.split(',').map(s => s.trim()).filter(Boolean);

	switch (mode) {
		case 0: // reset — all on
			for (const key of groups.keys()) groups.set(key, true);
			console.log('%csetlog →%c reset: all on', 'color:#9ca3af', '');
			break;
		case 2: // only
			for (const key of groups.keys()) groups.set(key, false);
			for (const n of names) {
				if (!groups.has(n)) groups.set(n, true); // auto-register
				groups.set(n, true);
			}
			console.log('%csetlog →%c only: %s', 'color:#f59e0b', '', names.join(', '));
			break;
		case 3: // reject
			for (const n of names) {
				if (!groups.has(n)) groups.set(n, false);
				groups.set(n, false);
			}
			console.log('%csetlog →%c rejected: %s', 'color:#ef4444', '', names.join(', '));
			break;
		default: // 1 — toggle on
			for (const n of names) {
				if (!groups.has(n)) groups.set(n, true);
				groups.set(n, true);
			}
			console.log('%csetlog →%c toggled on: %s', 'color:#60a5fa', '', names.join(', '));
	}
	relog();
}

export function logger(name: string): Logger {
	if (!groups.has(name)) groups.set(name, true);
	const prefix = `[${name}]`;

	return {
		info(...args)  { if (groups.get(name)) console.info(prefix, ...args); },
		warn(...args)  { if (groups.get(name)) console.warn(prefix, ...args); },
		error(...args) { console.error(prefix, ...args); }, // always
		debug(...args) { if (groups.get(name)) console.debug(prefix, ...args); },
		group(label)   { if (groups.get(name)) console.group(`${prefix} ${label}`); },
		groupEnd()     { if (groups.get(name)) console.groupEnd(); },
	};
}

// wire globals
if (typeof window !== 'undefined') {
	(window as any).relog = relog;
	(window as any).setlog = setlog;
}
