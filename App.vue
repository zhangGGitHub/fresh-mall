<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";

	.van-submit-bar__text {
		text-align: center !important;
	}

	.shadow_btn {
		box-shadow: 10rpx 10rpx 10rpx rgba($color: #000000, $alpha: 0.3);
	}
</style>
