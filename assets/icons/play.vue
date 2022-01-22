<template><svg viewBox="0 0 74 86" xmlns="http://www.w3.org/2000/svg" :width="width" :height="height"><g fill="none"><path d="M73 43L1 84.57V1.43L73 43z" stroke-miterlimit="10" stroke-linecap="round" :stroke="fill"></path></g></svg></template>

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