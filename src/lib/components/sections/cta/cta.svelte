<script>
	import Button from '../../ui/button/button.svelte';
</script>

<section class="relative w-full overflow-hidden">
	<div class="grid grid-cols-4 grid-rows-2">
		<div class="col-span-2">
			<div class="h-full bg-card rounded-md shadow-sm p-4 flex flex-col justify-between">
				<div>
					<p class="mb-2 font-mono text-xs uppercase">// Invitation</p>
					<h3 class="font-sans text-3xl sm:text-4xl md:text-5xl font-black uppercase">Let's Work Together</h3>
					<p class="mt-3 text-sm text-muted-foreground max-w-md">
						Discuss your project with us and see how we can help you achieve your goals.
						We are here to assist you in every step of the way.
					</p>
				</div>
				<div class="flex flex-row gap-2">
					<Button class="" href="/contact" size="lg">Contact Us</Button>
					<Button class="" href="/services" size="lg" variant="secondary">Services</Button>
				</div>
			</div>
		</div>
		<div class="col-span-2 row-span-2 col-start-3 aspect-square">
			<img alt="nasa" class="aspect-square object-cover"
					 src="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
		</div>
		<div class="row-start-2 aspect-square">
			<img alt="nasa" class="aspect-square object-cover"
					 src="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
		</div>
		<div class="row-start-2"><img alt="nasa" class="aspect-square object-cover"
																	src="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
		</div>
	</div>
</section>