<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if (!uni.getStorageSync('isLogin')) {
				uni.setStorageSync('isLogin', false)
			}
			// 检查是否有token 有的话检查token是否失效 没有就重新登录
			if (uni.getStorageSync('token')) {
				this.uniFly.post({
					url: '/user/checkToken',
					params: {
						token: uni.getStorageSync('token')
					}
				}).then(res => {
					console.log('检测token是否失效', res)
					if (res.data.code == 0) {
						uni.setStorageSync('isLogin', true)
					} else {
						uni.setStorageSync('isLogin', false)
						uni.removeStorageSync('token')
					}
				})
			} else {
				uni.setStorageSync('isLogin', false)
			}
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
		text-align: left !important;
		padding-left: 50rpx;
	}

	.shadow_btn {
		box-shadow: 10rpx 10rpx 10rpx rgba($color: #000000, $alpha: 0.3);
	}
</style>
