<script lang="ts">
	import { storable } from '$lib/stores/storable';

	type FormData = {
		Name: string;
		Phone: string;
		Email: string;
	};

	const { subscribe: formDataSubscribe } = storable<FormData | null>('FD', null);
	let formDataValue: FormData | null;

	formDataSubscribe((value) => {
		formDataValue = value;
	});
</script>

<main class="flex flex-col items-center justify-center h-screen p-4">
	<div class="shadow-md card card-compact bg-base-100">
		<div class="card-body">
			<h2 class="text-xl font-bold">Profile</h2>
			<div class="grid grid-cols-2 gap-4">
				<label for="profile-name" class="font-bold">Name:</label>
				<div id="profile-name">{formDataValue ? formDataValue.Name : '-'}</div>

				<label for="profile-phone" class="font-bold">Phone:</label>
				<div id="profile-phone">{formDataValue ? formDataValue.Phone : '-'}</div>

				<label for="profile-email" class="font-bold">Email:</label>
				<div id="profile-email">{formDataValue ? formDataValue.Email : '-'}</div>
			</div>
		</div>
	</div>

	<div class="absolute top-4 right-4">
		<a href="/" class="btn btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>

			<span class="ml-2">Voltar</span>
		</a>
	</div>
</main>
