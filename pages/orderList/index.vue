<template>
	<view>
		<van-sticky>
			<van-tabs :active="activeIndex" @change="changeTabs" :swipe-threshold="5" color="#007AFF">
				<!-- 0:全部 1:未支付 2:已支付 3:已发货 4:已退货 -->
				<van-tab v-for="(item,index) in ['全部订单','未支付','已支付','已发货','已退货']" :key="index" :title="item" />
			</van-tabs>
		</van-sticky>
		<view class="margin-top-sm bg-white" v-for="(item,index) in showOrderList" :key="index">
			<view class="flex align-center justify-between text-sm title" @click="showOrder">
				<text style="color: #949494;">订单编号:{{item.orderNo}}</text>
				<text v-for="(item1,index1) in tabs" :key="index1" v-if="item.orderStatus==index1" :style="'color:'+item1.color">{{item1.name}}</text>
			</view>
			<view class="detail flex align-center justify-between" v-for="(items,indexs) in item.details" :key="indexs" @click="showOrder">
				<view>
					<image :src="items.goodsImage" style="width: 120rpx;height: 120rpx;" />
				</view>
				<view class="margin-left-sm" style="flex: 1;">
					<view class="flex align-center justify-between text-df text-black padding-top-xs padding-bottom-sm">
						<text>{{items.goodsName}}</text>
						<text class="text-price">{{items.price}}</text>
					</view>
					<view class="text-sm flex align-center justify-end">
						x{{items.num}}
					</view>
				</view>
			</view>
			<view class="total flex align-center justify-between">
				<van-tag v-for="(item1,index1) in tabs" :key="index1" size="medium" :color="item1.color" v-if="item.orderStatus==index1">{{item1.name}}</van-tag>
				<view class="flex align-center justify-end text-sm">
					<view class="margin-right-sm">共{{item.totalNum}}件商品</view>
					<view class="flex align-center">
						<text>合计</text>
						<text>
							<text class="text-bold text-black" style="font-size: 28rpx;">￥</text>
							<text class="text-bold text-black" style="font-size: 36rpx;">{{item.totalPrice}}</text>
						</text>
					</view>
				</view>
			</view>
			<view class="time flex justify-end text-xs text-grey">
				{{item.createTime}}
			</view>
			<view class="button_group flex justify-end">
				<view class="margin-right">
					<van-button type="info" plain size="small" v-if="item.orderStatus==0" @click="payOrder(index)">付款</van-button>
				</view>
				<view>
					<van-button type="info" plain size="small" v-if="item.orderStatus==0 || item.orderStatus==3" @click="deleteOrder">删除订单</van-button>
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
				orderListAll: [],
				// 要展示的订单
				showOrderList: [],
				// 颜色:
				tabs: [{
					color: '#f37b1d',
					name: '待支付'
				}, {
					color: '#39b54a',
					name: '已支付'
				}, {
					color: '#0081ff',
					name: '已发货'
				}, {
					color: '#e54d42',
					name: '已退货'
				}]
			}
		},
		onLoad: function(options) {
			// 0:全部 1:未支付 2:已支付 3:已发货 4:已退货
			if (options.active) {
				this.activeIndex = Number(options.active)
			}
			// 获取订单
			this.getOrderList(options.active)
		},
		methods: {
			// 点击付款
			payOrder: function(index) {
				Toast('支付订单')
				console.log(this.showOrderList[index])
			},
			// 点击删除
			deleteOrder: function() {
				Toast('删除订单')
			},
			// 点击查看
			showOrder: function() {
				Toast('查看订单')
			},
			// 获取订单列表
			getOrderList: function(active) {
				Toast.loading({
					message: '加载中',
					duration: 0
				});
				this.uniFly.post({
					url: '/shops/order/list',
					params: {
						userId: uni.getStorageSync('userInfo').userId,
						shopsId: uni.getStorageSync('selectShopDetail').id
					}
				}).then(res => {
					console.log('全部订单列表', res)
					if (res.data.code == 0) {
						res.data.data.forEach(r => {
							r.totalNum = 0
							r.totalPrice = 0
							r.details.forEach(rr => {
								r.totalNum += Number(rr.num)
								r.totalPrice = (Number(r.totalPrice) + (Number(rr.num) * Number(rr.price))).toFixed(2)
							})
						})
						this.orderListAll = res.data.data
						Toast.clear()
						if (active == 0) {
							this.showOrderList = res.data.data
						}
						if (active == 1) {
							this.showOrderList = res.data.data.filter(r => {
								return r.orderStatus == 0
							})
						}
						if (active == 2) {
							this.showOrderList = res.data.data.filter(r => {
								return r.orderStatus == 1
							})
						}
						if (active == 3) {
							this.showOrderList = res.data.data.filter(r => {
								return r.orderStatus == 2
							})
						}
						if (active == 4) {
							this.showOrderList = res.data.data.filter(r => {
								return r.orderStatus == 3
							})
						}
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 切换标签栏
			changeTabs: function(e) {
				this.activeIndex = e.detail.index
				if (e.detail.index == 0) {
					this.showOrderList = this.orderListAll
				}
				if (e.detail.index == 1) {
					this.showOrderList = this.orderListAll.filter(r => {
						return r.orderStatus == 0
					})
				}
				if (e.detail.index == 2) {
					this.showOrderList = this.orderListAll.filter(r => {
						return r.orderStatus == 1
					})
				}
				if (e.detail.index == 3) {
					this.showOrderList = this.orderListAll.filter(r => {
						return r.orderStatus == 2
					})
				}
				if (e.detail.index == 4) {
					this.showOrderList = this.orderListAll.filter(r => {
						return r.orderStatus == 3
					})
				}
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
