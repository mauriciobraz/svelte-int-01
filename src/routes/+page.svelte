<script lang="ts">
	import { onMount } from 'svelte';

	import Form from '$lib/components/Form.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { storable } from '$lib/stores/storable';

	type FormData = {
		name: string;
		phone: string;
		email: string;
	};

	const SUBMIT_POOL = 50;
	const SUBMIT_TIMEOUT = 15000;

	const INFO_MODAL_ID = 'INFO_MODAL';
	const SUBMIT_MODAL_ID = 'SUBMIT_MODAL';

	const {
		subscribe: countdownSubscribe,
		update: updateCountdown,
		set: setCountdown
	} = storable<number | null>('CTD', SUBMIT_TIMEOUT);

	const {
		subscribe: finishedOnTimeSubscribe,
		update: updateFinishedOnTime,
		set: setFinishedOnTime
	} = storable<boolean | null>('FOT', null);

	const {
		subscribe: formDataSubscribe,
		update: updateFormData,
		set: setFormData
	} = storable<FormData | null>('FD', null);

	const {
		subscribe: startedAtSubscribe,
		update: updateStartedAt,
		set: setStartedAt
	} = storable<number | null>('SAT', null);

	let countdownValue: number | null = SUBMIT_TIMEOUT;
	let finishedOnTimeValue: boolean | undefined | null = null;
	let formDataValue: FormData | undefined | null = null;

	let startedAt: number | null = null;
	let timerInterval: number | null = null;

	$: currentStep = formDataValue ? 'submit' : 'info';

	countdownSubscribe((value) => (countdownValue = value));
	finishedOnTimeSubscribe((value) => (finishedOnTimeValue = value));

	formDataSubscribe((value) => {
		formDataValue = value;
		currentStep = value ? 'submit' : 'info';
	});

	startedAtSubscribe((value) => (startedAt = value));

	$: formattedTime = countdownValue ? Math.floor(countdownValue / 1000) : '00:00';

	onMount(() => {
		if (currentStep === 'submit' && startedAt !== null && !finishedOnTimeValue) {
			timerInterval = setInterval(() => {
				countdownValue! -= SUBMIT_POOL;
				setCountdown(countdownValue);

				if (countdownValue === 0) {
					clearInterval(timerInterval!);
					setFinishedOnTime(false);

					const submitModal = document.getElementById(SUBMIT_MODAL_ID) as HTMLDialogElement;
					submitModal.showModal();
				}
			}, SUBMIT_POOL);
		}
	});

	function handleFormData(event: CustomEvent<FormData>) {
		const modal = document.getElementById(INFO_MODAL_ID) as HTMLDialogElement;
		modal?.close();

		setFormData(event.detail);
		currentStep = 'submit';
	}

	function handleStart() {
		// Handle finish
		if (startedAt !== null) {
			clearInterval(timerInterval!);
			setFinishedOnTime(true);

			const submitModal = document.getElementById(SUBMIT_MODAL_ID) as HTMLDialogElement;
			submitModal.showModal();

			return;
		}

		// Handle start

		setStartedAt(Date.now());
		setCountdown(SUBMIT_TIMEOUT);

		timerInterval = setInterval(() => {
			countdownValue! -= SUBMIT_POOL;
			setCountdown(countdownValue);

			if (countdownValue === 0) {
				clearInterval(timerInterval!);
				setFinishedOnTime(false);

				const submitModal = document.getElementById(SUBMIT_MODAL_ID) as HTMLDialogElement;
				submitModal.showModal();
			}
		}, SUBMIT_POOL);

		console.table({ startedAt, countdownValue, finishedOnTimeValue });
	}

	function reset() {
		const isBrowser = typeof window !== 'undefined';

		if (isBrowser) {
			localStorage.clear();
		}

		currentStep = 'info';
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Lesser Candidate Assessment Programming Challenge</title>
	<meta name="description" content="This is a simple webpage created as a programming challenge." />
</svelte:head>

<main class="flex flex-col items-center justify-center h-screen p-4">
	{#if currentStep === 'info'}
		<Modal id={INFO_MODAL_ID}>
			<div class="flex flex-col space-y-4">
				<h1 class="text-xl text-bold">Lesser Candidate Assessment</h1>

				<Form
					id="form"
					labels={{
						submit: 'Iniciar Desafio'
					}}
					inputs={[
						{ id: 'name', name: 'Name', type: 'text', placeholder: 'John Doe' },
						{ id: 'phone', name: 'Phone', type: 'tel', placeholder: '555-555-5555' },
						{ id: 'email', name: 'Email', type: 'email', placeholder: 'john.doe@acme.com' }
					]}
					on:submit={handleFormData}
				/>
			</div>
		</Modal>
	{/if}

	{#if currentStep === 'submit'}
		<div class="flex flex-col items-center w-full max-w-2xl space-y-4 min-w-xl">
			<div class="text-4xl">
				{#if typeof finishedOnTimeValue === 'boolean'}
					{finishedOnTimeValue
						? '🎉 Desafio finalizado com sucesso!'
						: 'Desafio finalizado com falha!'}
				{:else}
					{formattedTime}s
				{/if}
			</div>

			<progress
				max="100"
				value={((SUBMIT_TIMEOUT - (countdownValue ?? 0)) / SUBMIT_TIMEOUT) * 100}
				class="w-full rounded-full progress-primary"
				class:progress-error={finishedOnTimeValue === false}
				class:progress-success={finishedOnTimeValue === true}
			/>

			<button
				type="button"
				id="btn-submit"
				class="w-full btn btn-primary"
				class:btn-disabled={typeof finishedOnTimeValue === 'boolean'}
				on:click|preventDefault={handleStart}
			>
				{#if typeof finishedOnTimeValue === 'boolean'}
					{finishedOnTimeValue
						? 'Desafio finalizado com sucesso!'
						: 'Tempo esgotado, desafio finalizado com falha!'}
				{:else if startedAt === null}
					Iniciar Desafio
				{:else}
					Enviar
				{/if}
			</button>

			<Modal id={SUBMIT_MODAL_ID} hideOpenButton>
				<div class="flex flex-col space-y-4">
					<h1 class="text-xl text-bold">Lesser Candidate Assessment</h1>
					<p>
						{finishedOnTimeValue
							? 'Desafio finalizado com sucesso!'
							: 'Tempo esgotado, desafio finalizado com falha!'}
					</p>
				</div>
			</Modal>
		</div>
	{/if}
	<div class="absolute top-4 right-4">
		<button type="button" class="btn btn-primary" on:click={reset}>Reset</button>
		<a id="btn-candidate" href="/candidate" class="btn btn-primary">Perfil</a>
	</div>
</main>
