// Action: Clipboard

export function clipboard(node: HTMLElement, args: any) {
	const onClick = () => {
		// Handle `data-clipboard` target based on object key
		if (typeof args === 'object') {
			// Element Inner HTML
			if (Object.prototype.hasOwnProperty.call(args, 'element')) {
				const element: HTMLElement | null = document.querySelector(`[data-clipboard="${args.element}"]`);
				copyToClipboard(element?.innerHTML, 'text/html');
				return;
			}
			// Form Input Value
			if (Object.prototype.hasOwnProperty.call(args, 'input')) {
				const input: HTMLInputElement | null = document.querySelector(`[data-clipboard="${args.input}"]`);
				copyToClipboard(input?.value);
				return;
			}
		}
		// Handle everything else.
		copyToClipboard(args);
	};
	// Event Listener
	node.addEventListener('click', onClick);
	// Lifecycle
	return {
		update(newArgs: any) {
			args = newArgs;
		},
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}

// Shared copy method
async function copyToClipboard(data: any, mimeType = 'text/plain') {
	if (navigator.clipboard.write) {
		console.log('writing to clipboard', data, mimeType);
		await navigator.clipboard.write([
			new ClipboardItem({
				[mimeType]: new Blob([data], {
					type: mimeType
				})
			})
		]);
	} else {
		// fallback since .writeText has wider browser support
		await new Promise((resolve, reject) => {
			resolve(navigator.clipboard.writeText(String(data)));
		});
	}
}
