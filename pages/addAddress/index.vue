<template>
	<view style="margin-top: 20rpx;">
		<van-cell-group>
			<van-field label="收货人" placeholder="请输入收货人姓名" />
			<van-field label="手机号码" type="number" placeholder="请输入收货人手机号码" />
			<picker mode="region" @change="getCity">
				<van-field label="所在城市" placeholder="请选择城市" :readonly="true" :value="city" is-link />
			</picker>
			<van-field label="收货地址" placeholder="请输入详细的收货地址" />
			<van-cell title="设为默认地址">
				<view slot="right-icon">
					<switch :checked="switchChecked" @change="changeSwitch" />
				</view>
			</van-cell>
		</van-cell-group>
		<view class="padding" style="padding-top: 60rpx;">
			<van-button block type="info" custom-class="shadow_btn">保存收货地址</van-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 滑块开关
				switchChecked: true,
				// 省市区
				city: ''
			}
		},
		methods: {
			// 切换switch
			changeSwitch: function() {
				this.switchChecked = !this.switchChecked
			},
			// 选择城市
			getCity: function(e) {
				console.log(e.detail.value)
				this.city = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
			}
		}
	}
</script>

<style scoped>

</style>
