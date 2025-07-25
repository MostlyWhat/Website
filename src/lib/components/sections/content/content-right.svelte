<script>
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<section class="h-screen grid grid-cols-1 md:grid-cols-2 border">
	<div class="relative">
		<img
			alt="Content illustration"
			class="w-full h-full object-cover"
			src="https://images.pexels.com/photos/13733387/pexels-photo-13733387.jpeg"
		/>
	</div>
	<div class="bg-primary text-primary-foreground px-8 py-16 flex flex-col justify-center items-start">
		<div class="max-w-md">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
				Content Right Section
			</h2>
			<p class="mt-4 text-primary-foreground/80">
				This is a placeholder for the content right section. You can add your content here.
			</p>
			<Button class="mt-6" variant="secondary">
				Learn More
			</Button>
		</div>
	</div>
</section>