<template><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" :width="width" :height="height"><g fill="none"><path d="M31.004 30.698L1.305 1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" :stroke="fill"></path><path d="M1 30.819L30.698 1.12" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" :stroke="fill"></path></g></svg></template>

<script>
export default {
	props: {
		width: {
			type: [Number, String],
			default: "100%"
		},
		height: {
			type: [Number, String],
			default: "100%"
		},
		strokewidth: {
			type: [Number, String],
			default: 1
		},
		fill: {
			type: String,
			default: "currentColor"
		},
		secondaryfill: {
			type: String
		}
	},
	computed: {
		_secondaryfill: function () {
			return this.secondaryfill || this.fill
		}
	}
}
</script>