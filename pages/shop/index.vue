<template>
	<view class="container">
		<view style="border-bottom: 2rpx solid #EEEEEE;height: 110rpx;">
			<van-search placeholder="请输入搜索关键词" shape="round" />
		</view>
		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop">
			<view v-for="(item,index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab==index ? 'active' : '']"
			 :data-current="index" @tap.stop="swichNav">
				<text>{{item.name}}</text>
			</view>
		</scroll-view>

		<scroll-view scroll-y class="right-box">
			<block v-for="(item,index) in tabbar[currentTab].list" :key="index">
				<view class="padding-top-xs flex">
					<view>
						<image src="https://dummyimage.com/100x100/red" style="width: 140rpx;height: 140rpx;" />
					</view>
					<view class="padding-left-xs flex flex-direction padding-right" style="flex: 1;">
						<view>{{item.name}}</view>
						<view class="text-gray text-sm">销量{{item.num1}} 库存{{item.num2}}</view>
						<view class="flex justify-between align-center" style="margin-top: auto;">
							<text class="text-price">{{item.price}}</text>
							<view v-if="num!=0">
								<van-stepper :value="num" :min="0" @minus="num--" @plus="num++" />
							</view>
							<view v-else>
								<view class="num" @click="num++"></view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view>
			<van-submit-bar :price="3050" button-text="提交订单">
				<view @click="isShowShopCar=true">
					<image src="../../static/shopcart.png" style="width: 80rpx;height: 80rpx;margin-left:50rpx;" />
				</view>
			</van-submit-bar>
		</view>
		<van-popup :show="isShowShopCar" position="bottom" custom-style="height: 20%;" @click-overlay='isShowShopCar=false' round />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbar: [{
					name: '推荐套餐',
					list: [{
						name: '肉类套餐1',
						id: '0',
						price: '328.00',
						num1: '4',
						num2: '500'
					}]
				}, {
					name: '团购套餐',
					list: [{
						name: '蔬菜套餐1',
						id: '0',
						price: '50.00',
						num1: '1',
						num2: '499'
					}, {
						name: '蔬菜套餐2',
						id: '1',
						price: '98.00',
						num1: '0',
						num2: '999'
					}]
				}],
				currentTab: 0, //预设当前项的值
				scrollTop: 0, //tab标题的滚动条位置
				num: 0,
				isShowShopCar:false
			}
		},
		onLoad: function(options) {

		},
		methods: {
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur;
					this.checkCor();
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				let that = this;
				//这里计算按照实际情况进行修改，动态数据要进行动态分析
				//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
				//数据很多可以多次if判断然后进行滚动距离计算即可
				if (that.currentTab > 7) {
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
