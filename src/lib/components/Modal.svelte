<script lang="ts">
	export let id: string;
	export let hideOpenButton: boolean = false;

	let dialog: HTMLDialogElement;
</script>

{#if !hideOpenButton}
	<button id={`btn-${id}`} class="btn btn-primary" on:click={() => dialog.showModal()}
		>Open Modal</button
	>
{/if}

<dialog {id} class="modal" bind:this={dialog}>
	<div class="modal-box">
		<form method="dialog">
			<button class="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
		</form>

		<slot />
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>Hidden Close Button</button>
	</form>
</dialog>
