<template>
	<view class="container">
		<view style="border-bottom: 2rpx solid #EEEEEE;height: 110rpx;">
			<van-search placeholder="请输入搜索关键词" shape="round" />
		</view>
		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop">
			<view v-for="(item,index) in commodityGroup" :key="index" class="tab-bar-item" :class="[commodityGroupIndex==index ? 'active' : '']"
			 :data-current="index" @tap.stop="swichNav">
				<text>{{item.typeName}}</text>
			</view>
		</scroll-view>

		<scroll-view scroll-y class="right-box">
			<block v-for="(item,index) in commodityGroup[commodityGroupIndex].goods" :key="index">
				<view class="padding-top-xs flex">
					<view>
						<image :src="item.goodsImage" style="width: 140rpx;height: 140rpx;" />
					</view>
					<view class="padding-left-xs flex flex-direction padding-right" style="flex: 1;">
						<view>{{item.goodsName}}</view>
						<view class="text-gray text-sm">销量{{item.sellNum}} 库存{{item.stock}}</view>
						<view class="flex justify-between align-center" style="margin-top: auto;">
							<text class="text-price">{{item.price}}</text>
							<view v-if="item.num!=0">
								<van-stepper :value="item.num" :disable-input="true" :long-press="false" :min="0" @minus="goodsLessNum(index)"
								 @plus="goodsAddNum(index)" />
							</view>
							<view v-else>
								<view class="num" @click="goodsAddNum(index)"></view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view>
			<van-submit-bar :price="totalPrice*100" :disabled="totalPrice==0 ? true:false" button-text="提交订单" button-type="info"
			 @submit="isShowShopCar=true">
				<view @click="isShowShopCar=true">
					<image src="../../static/shopcart.png" style="width: 80rpx;height: 80rpx;margin-left:50rpx;" />
				</view>
			</van-submit-bar>
		</view>
		<van-popup :show="isShowShopCar" position="bottom" @click-overlay="isShowShopCar=false" round>
			<view class="padding">
				<view class="padding-bottom text-center text-bold text-xl">已购商品</view>
				<view class="flex align-center justify-between padding-bottom-xs padding-left-xs padding-right-xs" style="font-size: 30rpx;"
				 v-for="(item,index) in selectCommodityList" :key="index">
					<text>{{item.goodsName}}</text>
					<text>单价：<text class="text-price text-orange">{{item.price}}</text></text>
					<text>数量：x{{item.num}}</text>
					<!-- <text>总价：<text class="text-price text-red">{{item.price * item.num}}</text></text> -->
				</view>
				<view class="padding-top flex justify-end">
					<van-button type="info" size="normal">确认付款</van-button>
				</view>
			</view>
		</van-popup>
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
				// 商品的分类
				commodityGroup: [],
				// 选择的商品分类下标 默认第一个
				commodityGroupIndex: 0,
				// tab标题的滚动条位置
				scrollTop: 0,
				// 总价格
				totalPrice: 0,
				// 选择的商品
				selectCommodityList: [],
				// 是否展示弹出层
				isShowShopCar: false
			}
		},
		onLoad: function() {
			if (uni.getStorageSync('selectShopDetail')) {
				this.getCommodityGroup(uni.getStorageSync('selectShopDetail').id)
			} else {
				this.commodityGroup = []
				Dialog.alert({
					title: '提示',
					message: '检测到未选择商铺,请先选择商铺'
				}).then(() => {
					uni.switchTab({
						url: '../index/index'
					})
				})
			}
		},
		watch: {
			commodityGroup: { //监听的对象
				deep: true, //深度监听设置为 true
				handler: function(e) {
					var price = 0
					var arr = []
					e.forEach(r => {
						r.goods.forEach(rr => {
							arr.push(rr)
							price += rr.num * rr.price
						})
					})
					this.selectCommodityList = arr.filter(r => {
						return r.num != 0
					})
					this.totalPrice = price
				}
			}
		},
		methods: {
			// 商品加数量
			goodsAddNum: function(e) {
				var that = this
				this.commodityGroup[this.commodityGroupIndex].goods[e].num++
			},
			// 商品减数量
			goodsLessNum: function(e) {
				this.commodityGroup[this.commodityGroupIndex].goods[e].num--

			},
			// 获取商品和分类
			getCommodityGroup: function(id) {
				this.uniFly.post({
					url: '/shops/goods/selectGoods',
					params: {
						shopsId: id
					}
				}).then(res => {
					console.log('商品分类', res)
					res.data.data.forEach(r => {
						r.goods.forEach(rr => {
							rr.num = 0
						})
					})
					this.commodityGroup = res.data.data
				})
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.commodityGroupIndex == cur) {
					return false;
				} else {
					this.commodityGroupIndex = cur;
					this.checkCor();
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				let that = this;
				//这里计算按照实际情况进行修改，动态数据要进行动态分析
				//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
				//数据很多可以多次if判断然后进行滚动距离计算即可
				if (that.commodityGroupIndex > 7) {
					that.scrollTop = 500
				} else {
					that.scrollTop = 0
				}
			}
		}
	}
</script>

<style>
	page {
		background: #fcfcfc;
	}

	/* 左侧导航布局 start*/

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tab-view {
		/* height: 100%; */
		height: calc(100vh - 210rpx);
		width: 200upx;
		position: fixed;
		top: 110rpx;
		left: 0;
		z-index: 10;
		background: #f6f6f6;
	}

	.tab-bar-item {
		width: 200upx;
		height: 110upx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26upx;
		color: #444;
		font-weight: 400;
	}

	.active {
		position: relative;
		color: #007AFF;
		font-size: 30upx;
		font-weight: 600;
		background: #fcfcfc;
		transition: all .2s;
	}

	.active::before {
		content: "";
		position: absolute;
		border-left: 8upx solid #007AFF;
		height: 30upx;
		left: 0;
	}

	/* 左侧导航布局 end*/

	.right-box {
		height: calc(100vh - 210rpx);
		width: 100%;
		position: fixed;
		padding-left: 220upx;
		box-sizing: border-box;
		left: 0;
		top: 110rpx;
	}


	.num {
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		margin: 1px;
		vertical-align: middle;
		border: 0;
		background-color: #f2f3f5;
		color: #323233;
		width: 28px;
		height: 28px;
		padding: 4px;
		border-radius: 0 8rpx 8rpx 0;
	}

	.num::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		background-color: currentColor;
		content: "";
		width: 9px;
		height: 1px;
	}

	.num::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		background-color: currentColor;
		content: "";
		width: 1px;
		height: 9px;
	}
</style>
