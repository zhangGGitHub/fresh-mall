<template>
	<view style="margin-top: 10rpx;">
		<view v-for="(item,index) in addressList" :key="index" class="address_list bg-white flex justify-between">
			<view class="padding detail" @click="changeDefault(index)" style="flex: 1;padding-right: 0;">
				<view class="flex align-center">
					<view style="width: 140rpx">{{item.consignee}}</view>
					<view>{{item.phoneNumber}}</view>
				</view>
				<view class="padding-top-xs flex align-center">
					<view style="width: 140rpx">
						<van-tag type="primary" v-if="activeIndex==index">默认地址</van-tag>
					</view>
					<view class="address">
						{{item.address}}
					</view>
				</view>
			</view>
			<view class="flex flex-direction align-center justify-center modify" style="width: 100rpx;">
				<text class="cuIcon-write" style="font-size: 40rpx;" />
			</view>
		</view>
		<view class="padding">
			<van-button block type="info" custom-class="shadow_btn" @click="addAddress">新增收货地址</van-button>
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
				// 地址列表
				addressList: [],
				// 点击的下标
				activeIndex: 0
			}
		},
		onLoad: function() {
			this.getAddressList()
		},
		methods: {
			// 获取所有地址列表
			getAddressList: function() {
				this.uniFly.post({
					url: '/addr/list',
					params: {
						userId: uni.getStorageSync('userInfo').userId
					}
				}).then(res => {
					console.log('地址列表', res)
					if (res.data.code == 0) {
						this.addressList = res.data.data
						res.data.data.forEach(r => {
							console.log(r)
							r.address = r.city.split('-')[0] + r.city.split('-')[1] + r.city.split('-')[2] + r.shippingAddress
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 切换默认地址
			changeDefault: function(index) {
				this.activeIndex = index
			},
			// 跳转新增收货地址
			addAddress: function() {
				uni.navigateTo({
					url: '../addAddress/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address_list {
		margin-bottom: 10rpx;
		border-bottom: 2rpx solid #EEEEEE;
		box-shadow: 4rpx 4rpx 4rpx rgba($color: #000000, $alpha: 0.1);
	}

	.modify:active {
		background: #f6f6f6;
	}

	.detail:active {
		background: #f6f6f6;
	}

	.address {
		// flex: 1;
		width: 480rpx;
		height: 60rpx;
		line-height: 60rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
