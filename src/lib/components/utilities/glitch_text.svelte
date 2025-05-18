<script lang="ts">
	let { text_input } = $props();
	let text = $state(text_input);

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	function animate() {
		const target = text;

		let iteration = 0;

		const interval = setInterval(() => {
			text = target
				.split('')
				.map((letter, index) => {
					if (index < iteration) {
						return target[index];
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join('');

			if (iteration >= target.length) {
				clearInterval(interval);
			}

			iteration += 1 / 3;
		}, 30);
	}
</script>

<span onfocus={animate()} onmouseover={animate()}>{text}</span>