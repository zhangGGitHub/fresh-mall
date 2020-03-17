<template>
	<view style="margin-top: 10rpx;">
		<view v-for="(item,index) in 3" :key="index" class="address_list bg-white flex justify-between">
			<view class="padding detail" @click="changeDefault(index)">
				<view class="flex align-center">
					<view style="width: 140rpx">姓名</view>
					<view>132****9004</view>
				</view>
				<view class="padding-top-xs flex align-center">
					<view style="width: 140rpx">
						<van-tag type="primary" v-if="activeIndex==index">默认地址</van-tag>
					</view>
					<view style="height: 60rpx;line-height: 60rpx;">
						地址地址地址地址地址地址地址
					</view>
				</view>
			</view>
			<view class="flex align-center justify-center modify" style="flex: 1;">
				<text class="cuIcon-write" style="font-size: 40rpx;" />
			</view>
		</view>
		<view class="padding">
			<van-button block type="info" custom-class="shadow_btn" @click="addAddress">新增收货地址</van-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0
			}
		},
		methods: {
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
</style>
