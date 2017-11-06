// 商店组件
var Shop = {
	template: '#tpl_shop',
	// 绑定数据
	data: function() {
		return {
			shop: {}
		}
	},
	// 加载数据
	created: function() {
		this.$http
			.get('data/dks.json')
			// 返回的数据
			.then(function(res) {
				// 将数据存储
				this.shop = res.data.data;
			})
	}
}
// 商品组件
var Product = {
	template: '#tpl_product',
	// 绑定数据
	data: function() {
		return {
			nav: []
		}
	},
	// 发送请求
	created: function() {
		this.$http
			// 请求
			.get('data/menu.json')
			// 缓存数据
			.then(function(res) {
				// 缓存
				this.nav = res.data.data;
			})
	}
}
// 每一个产品组件
var Food = {
	template: '#tpl_food',
	// 绑定数据
	data: function() {
		return {
			list: [],
	// 		// 缓存所有的数据
			all: {}
		}
	},
	// 封装方法
	methods: {
		getData: function() {
			// 判断是否存在该数据，存在了，直接走缓存，否则请求新的数据，并缓存
			var id = this.$route.params.foodId;
			if (this.all[id]) {
				// 从缓存中更新
				this.list = this.all[id]
			} else {
				// 没有缓冲，要请求
				this.$http
					// 发送get请求
					.get('data/' + id + '.json')
					// 请求成功，存储数据
					.then(function(res) {
						// 存储数据
						this.list = res.data.data;
						// 并缓存
						this.all[id] = res.data.data;
					})
			}
		},
		// 点击加号，增加数量
		add: function(item) {
			// 怎么获取当前产品
			// console.log(item)
			// 更新item
			item.num++
		},
		// 点击减号，减少数量
		reduce: function(item) {
			item.num--
		}
	},
	// 发送请求
	created: function() {
		// 加载数据
		this.getData();
	},
	// 监听组件的某个属性的变化
	watch: {
		$route: function() {
			// 加载数据
			this.getData();
		}
	}
}
// 第二步 定义规则
var routes = [
	{
		path: '/shop/:storeName',
		component: Shop,
		// 子路由第二步 定义规则
		children: [
			{
				path: 'product',
				component: Product,
				// 子路由
				children: [
					{
						path: 'food/:foodId',
						component: Food
					}
				]
			}
		]
	},
	// 定义默认路由
	{
		path: '*',
		// 一定义是一个存在的地址
		redirect: '/shop/dks/product/food/01'
	}
]
// 第三步 实例化路由
var router = new VueRouter({
	routes:  routes
})
// vuex 第一步创建store
var store = new Vuex.Store({
	// 定义共享数据
	state: {
		num: 0
	},
	// 注册修改方法
	mutations: {
		// 增加num值
		add: function(state, num) {
			state.num += +num
		},
		// 减少num
		reduce: function(state, num) {
			state.num -= num;
		}
	}
})

// 第四步 注册路由
var app = new Vue({
	el: '#ickt',
	data: {},
	// 注册路由
	router: router,
	// vuex 第二步 注册vuex
	store: store
})