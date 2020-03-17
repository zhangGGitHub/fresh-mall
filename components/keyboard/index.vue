<template name="keyboard">
	<van-popup :show="true" position="bottom" :overlay="false" custom-style="background-color:#f1f1f1">
		<view class="padding-sm padding-bottom flex justify-between text-bold text-xl">
			<view class="flex flex-wrap" style="flex: 1;">
				<view v-for="(item,index) in 9" :key="index" :data-index="index+1" class="number" @click="getNum">{{item+1}}</view>
				<view class="number zero" style="margin-bottom: 0;" data-index="0" @click="getNum">0</view>
				<view class="number" style="margin-bottom: 0;" data-index="." @click="getNum">.</view>
			</view>
			<view class="flex flex-direction" style="width: 23%;">
				<view class="delete" style="width: 100%;" @click="deleteNum">
					<text class="cuIcon-backdelete" />
				</view>
				<view class="pay flex align-center justify-center text-white" @click="pay">付款</view>
			</view>
		</view>
	</van-popup>
</template>

<script>
	export default {
		name: "keyboard",
		//属性
		props: {
			isShow: {
				type: Boolean, //属性类型
				value: true
			}
		},
		data() {
			return {
				money: ''
			}
		},
		watch: {
			money(val) {
				this.$emit('money', val); //主要
			}
		},
		methods: {
			// 获取输入的数字
			getNum: function(e) {
				uni.vibrateShort({})
				if (e.currentTarget.dataset.index == '.' && this.money == '') {
					this.money = '0.'
				} else if (e.currentTarget.dataset.index == '0' && this.money == '' || e.currentTarget.dataset.index == '0' &&
					this.money == '0') {
					this.money = '0'
				} else if (e.currentTarget.dataset.index == '.' && this.money.indexOf('.') != -1) {

				} else if (e.currentTarget.dataset.index == '0' && this.money == '0.0') {
					this.money = '0'
				} else {
					this.money = this.money.concat(e.currentTarget.dataset.index)
				}
			},
			// 点击删除按钮
			deleteNum: function() {
				uni.vibrateShort({})
				var str = this.money
				this.money = str.substr(0, str.length - 1)
			},
			// 点击付款
			pay: function() {
				uni.vibrateShort({})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.number {
		width: 30%;
		margin-bottom: 14rpx;
		margin-right: 18rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 4rpx;
		background-color: #FFFFFF;
		box-shadow: 4rpx 4rpx 4rpx rgba($color: #e9e9e9, $alpha: 0.7);
	}

	.zero {
		width: 63%;
	}

	.delete {
		width: 100%;
		margin-bottom: 14rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 4rpx;
		background-color: #FFFFFF;
	}

	.pay {
		flex: 1;
		background: #07C160;
		border-radius: 4rpx;
	}

	.number:active {
		background-color: #e4e4e4;
	}

	.delete:active {
		background-color: #e4e4e4;
	}

	.pay:active {
		background-color: #06ab53;
	}
</style>
