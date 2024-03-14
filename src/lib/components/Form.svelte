<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	const dispatch = createEventDispatcher<{ submit: any }>();

	function onSubmit(event: SubmitEvent) {
		const formData = new FormData(event.target as HTMLFormElement);

		const data: Record<string, FormDataEntryValue> = {};
		for (let [key, value] of formData) data[key] = value;

		dispatch('submit', data);
	}

	export let id: string;
	export let inputs: (HTMLInputAttributes & { id: string })[];
	export let labels: Record<'submit', string>;
</script>

<form method="dialog" class="flex flex-col gap-4" on:submit|preventDefault={onSubmit} {id}>
	{#each inputs as input}
		<div class="flex flex-col gap-2">
			<label class="label-text" for={input.id}> {input.name}</label>

			<input
				class="w-full max-w-full transition-colors duration-150 outline-none input input-bordered focus:outline-none focus:border-primary focus:ring-0 focus:ring-offset-0"
				{...input}
			/>
		</div>
	{/each}

	<button id="btn-submit-form" class="btn btn-primary">{labels.submit}</button>
</form>
