<template>
	<view>
		<view class="background">
			<image src="../../static/bg.jpeg" mode="aspectFill" style="width: 100vw;height: 440rpx;" />
		</view>
		<view class="text-white user flex align-center text-lg" v-if="isLogin">
			<image :src="userDetailWx.avatarUrl" class="shadow-warp" />
			<text class="text-bold" style="margin-left: 30rpx;flex:1">欢迎你，{{userDetailWx.nickName}}</text>
		</view>
		<view class="text-white user flex align-center" style="height: 220rpx;" v-else>
			<van-button plain hairline type="info" open-type="getUserInfo" @getuserinfo="getUserInfo">点击登录</van-button>
		</view>
		<view class="bg-white radius padding-top padding-bottom order shadow">
			<view class="padding flex align-center justify-between" style="border-bottom: 2rpx solid #EEEEEE;padding-top: 0;">
				<text class="text-black text-bold text-xl">我的订单</text>
				<view @click="toOrederList(0)">
					<text>查看全部订单</text>
					<text class="cuIcon-unfold" style="display:inline-block;transform:rotate(-90deg);"></text>
				</view>
			</view>
			<view class="padding flex justify-around align-center" style="padding-bottom: 0;">
				<view class="flex flex-direction align-center" @click="toOrederList(1)">
					<text class="cuIcon-sponsor icon" />
					<text class="text">待支付</text>
				</view>
				<view class="flex flex-direction align-center" @click="toOrederList(2)">
					<text class="cuIcon-cart icon" />
					<text class="text">待发货</text>
				</view>
				<view class="flex flex-direction align-center" @click="toOrederList(3)">
					<text class="cuIcon-goodsnew icon" />
					<text class="text">待收货</text>
				</view>
			</view>
		</view>
		<view class="money bg-white radius shadow flex justify-between">
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">优惠券</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0.00</text>
				<text class="padding-top-xs text-sm">余额</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">积分</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">赠品</text>
			</view>
		</view>
		<view class="list bg-white radius shadow">
			<van-cell-group>
				<van-cell title="地址管理" is-link @click="toAddressList" />
				<van-cell title="分享" is-link />
			</van-cell-group>
		</view>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default {
		data() {
			return {
				// 是否登录
				isLogin: false,
				// 临时登录凭证
				code: '',
				// 用户微信信息
				userDetailWx: {}
			}
		},
		onLoad: function() {
			this.isLogin = uni.getStorageSync('isLogin')
			if (uni.getStorageSync('isLogin')) {
				this.userDetailWx.nickName = uni.getStorageSync('userInfo').userName
				this.userDetailWx.avatarUrl = uni.getStorageSync('userInfo').avatar
			}
			var that = this
			// 获取临时code
			uni.login({
				success: (e) => {
					that.code = e.code
				}
			})
		},
		onShow: function() {
			this.isLogin = uni.getStorageSync('isLogin')
		},
		methods: {
			// 用户点击登录
			getUserInfo: function(e) {
				var that = this
				if (e.detail.errMsg == 'getUserInfo:ok') {
					console.log('用户点击登录', e)
					this.userDetailWx = e.detail.userInfo
					Toast.loading({
						mask: true,
						duration: 0,
						message: '登录中'
					})
					this.uniFly.post({
						url: '/user/decodeUserInfo',
						params: {
							iv: e.detail.iv,
							encryptedData: e.detail.encryptedData,
							code: that.code
						}
					}).then(res => {
						console.log('解密openid', res)
						if (res.data.code != 0) {
							Toast(res.data.code)
						}
						if (res.data.code == 0 && !res.data.data.openId) {
							Toast('openid解密失败,请重新登录')
						}
						if (res.data.code == 0 && res.data.data.openId) {
							// 通过openid登录
							that.loginByOpenId(e.detail.userInfo.avatarUrl, e.detail.userInfo.nickName, res.data.data.openId)
						}
					})
				}
			},
			// 通过openId登录
			loginByOpenId: function(avatarUrl, nickName, openId) {
				var that = this
				this.uniFly.post({
					url: '/user/loginByOpenId',
					params: {
						openId: openId,
						userName: nickName,
						avatar: avatarUrl
					}
				}).then(res => {
					console.log('通过openId登录', res)
					if (res.data.code == 0) {
						Toast('登陆成功')
						this.isLogin = true
						uni.setStorageSync('isLogin', true)
						uni.setStorageSync('openId', openId)
						uni.setStorageSync('userInfo', res.data.data.userInfo)
						uni.setStorageSync('token', res.data.data.token);
						that.uniFly.headers['Token'] = res.data.data.token;
					} else {
						Toast('登录失败,' + res.data.msg)
					}
				})
			},
			// 跳转地址管理页面
			toAddressList: function() {
				uni.navigateTo({
					url: '../addressList/index'
				})
			},
			// 跳转订单列表
			toOrederList: function(index) {
				uni.navigateTo({
					url: '../orderList/index?active=' + index
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.background {
		position: absolute;
		z-index: -999;
		border-bottom-left-radius: 30%;
		border-bottom-right-radius: 30%;
		overflow: hidden;
	}

	.user {
		padding: 40rpx 50rpx;

		// color: #E8F4D9;
		image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			border: 2px solid #FFFFFF;
		}
	}

	.order {
		width: 90%;
		margin: 0 auto;

		.icon {
			font-size: 54rpx;
		}

		.text {
			font-size: 24rpx;
			padding-top: 10rpx;
		}
	}

	.money {
		width: 90%;
		margin: 30rpx auto 0;
		padding: 30rpx 50rpx;
	}

	.list {
		width: 90%;
		margin: 30rpx auto 0;
	}
</style>
