/**
 * Transient confirmation. Navy pill, bottom-centre. Rendered once, empty and hidden; the client
 * fills and reveals it — there is only ever one on screen.
 */
export function Toast() {
	return (
		<div class="oo-toast-region" role="status" aria-live="polite">
			<div class="oo-toast" data-oo-toast hidden />
		</div>
	);
}
