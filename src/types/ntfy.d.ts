export interface NtfyViewAction {
	action: 'view';
	label: string;
	url: URL;
	clear?: boolean;
}

export interface NtfyBroadcastAction {
	action: 'broadcast';
	label: string;
	intent?: string;
	extras?: Record<string, string>[];
	clear?: boolean;
}

export interface NtfyHTTPAction {
	action: 'http';
	label: string;
	url: URL;
	method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
	headers?: Record<string, string>[];
	body?: string;
	clear?: boolean;
}

export type NtfyAction = NtfyViewAction | NtfyBroadcastAction | NtfyHTTPAction;
