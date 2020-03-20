<template>
	<view>
		<van-sticky>
			<van-tabs :active="activeIndex" @change="changeTabs" color="#007AFF">
				<van-tab v-for="(item,index) in ['全部订单','待支付','待发货','待收货']" :key="index" :title="item" />
			</van-tabs>
		</van-sticky>
		<view class="margin-top-sm bg-white">
			<view class="flex align-center justify-between text-sm title">
				<text style="color: #949494;">订单编号:PH8237819739812</text>
				<text style="color: #FF9C00">待支付</text>
			</view>
			<view class="detail flex align-center justify-between">
				<view>
					<image src="https://dummyimage.com/100x100/red" style="width: 120rpx;height: 120rpx;" />
				</view>
				<view class="margin-left-sm" style="flex: 1;">
					<view class="flex align-center justify-between text-df text-black padding-top-xs padding-bottom-sm">
						<text>肉类套餐1</text>
						<text class="text-price">1640.00</text>
					</view>
					<view class="text-sm flex align-center justify-end">
						x5
					</view>
				</view>
			</view>
			<view class="total flex align-center justify-between">
				<van-tag color="#FF9C00">未支付</van-tag>
				<view class="flex align-center justify-end text-sm">
					<view class="margin-right-sm">共五件商品</view>
					<view class="flex align-center">
						<text>合计</text>
						<text class="text-bold" style="color: #FF9C00;font-size: 28rpx;">￥</text>
						<text class="text-bold" style="color: #FF9C00;font-size: 36rpx;">1640.00</text>
					</view>
				</view>
			</view>
			<view class="time flex justify-end text-xs text-grey">
				2020-02-16 12:23:45
			</view>
			<view class="button_group flex justify-end">
				<view class="margin-right">
					<van-button type="info" size="small">付款</van-button>
				</view>
				<view>
					<van-button type="info" size="small">取消订单</van-button>
				</view>
			</view>
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
				// tabs的下标
				activeIndex: 0,
				// 全部订单列表
				orderListAll: []
			}
		},
		onLoad: function(options) {
			if (options.active) {
				this.activeIndex = Number(options.active)
			}
			// 获取订单
			this.getOrderList()
		},
		methods: {
			// 获取订单列表
			getOrderList: function() {
				this.uniFly.post({
					url: '/shops/order/list',
					params: {
						userId: uni.getStorageSync('userInfo').userId
					}
				}).then(res => {
					console.log('全部订单列表', res)
					if (res.data.code == 0) {

					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 切换标签栏
			changeTabs: function(e) {
				this.activeIndex = e.detail.index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		padding: 16rpx 30rpx;
		border-bottom: 1rpx solid #f9f9f9;
	}

	.detail {
		padding: 16rpx 30rpx;
		border-bottom: 1rpx solid #f9f9f9;
	}

	.total {
		padding: 16rpx 30rpx;
	}

	.time {
		padding: 0 30rpx 16rpx;
	}

	.button_group {
		padding: 10rpx 30rpx 30rpx;
	}
</style>
