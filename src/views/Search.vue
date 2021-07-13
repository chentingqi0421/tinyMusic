<template>
	<div class="box">
		<div class="searchbox">
			<span class="menuicon iconfont icon-left" @click="houtui"></span>
			<p class="search">
				<router-link to="/search">
					<input type="text" placeholder="搜索音乐、歌手、歌词" v-model="inpval" @keydown.enter="enterclick(inpval)" />
				</router-link>
				<span class="iconfont icon-sousuo"></span>
				<span class="iconfont icon-quxiao1" v-show="inpval.length > 0" @click="clearvalue"></span>
			</p>
		</div>
		<div class="hotsearch" v-show="inpval.length == 0">
			<MainTitle>热门搜索</MainTitle>
			<ul>
				<li v-for="(item, k) in hotsearch" :key="k" @click="clickhotsearch(item.searchWord)">
					<span class="num"> {{ k + 1 }} </span> {{item.searchWord}}<i class="hot" v-show="k < 3">hot</i>
				</li>
			</ul>
		</div>
		<div class="searchHistory" v-show="inpval.length == 0">
			<div class="title">
				<MainTitle>历史搜索</MainTitle>
				<Icon type="md-trash" size="18" @click="deleteAll" />
			</div>
			<!-- <div class="cell" v-for="(item,index) in searchHistory" :key="index">
				<span>{{item}}</span>
				<Icon type="md-trash" size="16" @click="deleteSearchHistory(index)" />
			</div> -->
			<div class="cell clearfix">
				<div class="fl" v-for="(item,index) in searchHistory" :key="index" @click="historyKeyword(item)">{{item}}</div>
			</div>
		</div>
		<div class="suggestbox" v-show="showsuggest">
			<ul>
				<li class="selfinput">
					搜索"<span>{{ inpval }}</span>"
				</li>
				<Loading v-show="searching" />
				<li v-for="item in suggests" :key="item.id" @click="clickList(item.name)">
					<span class="iconfont icon-sousuo"></span>{{ item.name }}
				</li>
				<!-- 点击搜索建议，把搜索关键字传给事件 -->
			</ul>
		</div>
		<div class="searchresult" v-show="showresult">
			<Searchresult :searchMusicList="searchMusicList"></Searchresult>
		</div>
	</div>
</template>
<script>
	import Loading from "../components/Loading";
	import Searchresult from "../components/Searchresult";
	import MainTitle from "../components/MainTitle";
	export default {
		name: "search",
		data() {
			return {
				inpval: "",
				hotsearch: [],
				suggests: [],
				searchMusicList: [],
				searching: false, //正在搜索
				showsuggest: false, //是否显示搜索提示,
				showresult: false, //是否显示 搜索结果
				inpflag: true, //是否进入监听
				searchHistory: [],
				throttle: true,
			};
		},
		components: {
			Loading,
			Searchresult,
			MainTitle
		},
		created() {
			this.getSearchHots();
			if (localStorage.getItem('searchHistory') != null) {
				this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')).data;
			}
		},
		methods: {
			getSearchHots() {
				this.axios.get("/search/hot/detail").then((result) => {
					this.hotsearch = result.data.data;
				});
			},
			houtui() {
				this.$router.back();
				this.inpval = ""; //清空输入框
				this.showresult = false;
			},
			clickhotsearch(v) {
				this.clickList(v); //直接把热搜值搜索出结果
			},
			clearvalue() {
				this.inpval = ""; //清空输入框
				this.showresult = false;
			},
			clickList(keywords) {
				this.addSearchHistory(keywords);
				//点击确认搜索 显示搜索结果列表
				// 点击改变搜索框数值
				(this.inpflag = false), //不进入监听
				(this.inpval = keywords);
				this.showsuggest = false; //隐藏搜索提示
				this.showresult = true; //显示搜索结果
				this.searching = true; //显示loading
				this.$http.get("/search?keywords=" + keywords).then((data) => {
					if (data.data.code == 200) {
						this.searching = false; //拿到数据后loading
						// console.log(data);
						// 整理数据，数据结构跟插件一致
						this.searchMusicList = data.data.result.songs.map((dat) => {
							return {
								name: dat.name,
								id: dat.id,
								song: {
									artists: dat.artists,
									album: {
										name: dat.album.name
									},
									privilege: {
										maxbr: 920000,
									},
								},
							};
						});
					}
				});
			},
			enterclick(val) { //enter搜索关键词
				this.clickList(val);
				this.inpflag = true; //打开input监听，否则删除不会弹出搜索
			},
			historyKeyword(item) {
				this.clickList(item);
			},
			addSearchHistory(keywords) {
				if (localStorage.getItem('searchHistory') == null) {
					localStorage.setItem('searchHistory', JSON.stringify({
						data: []
					}));
				}
				let searchHistory = JSON.parse(localStorage.getItem('searchHistory')).data;
				if (searchHistory.indexOf(keywords) < 0) {
					searchHistory.push(keywords);
					this.searchHistory = searchHistory;
					localStorage.setItem('searchHistory', JSON.stringify({
						data: this.searchHistory
					}));
				}
			},
			deleteAll() {
				this.searchHistory = [];
				localStorage.setItem('searchHistory', JSON.stringify({
					data: []
				}));
			},
			deleteSearchHistory(index) {
				let searchHistory = JSON.parse(localStorage.getItem('searchHistory')).data;
				let set = new Set(searchHistory);
				set.delete(searchHistory[index]);
				searchHistory = [...set];
				this.searchHistory = searchHistory;
				localStorage.setItem('searchHistory', JSON.stringify({
					data: searchHistory
				}));
			}
		},
		watch: {
			inpval(v) {
				if (v == '') {
					this.showresult = false;
					this.showsuggest = false;
				}
				if (this.inpflag && v && this.throttle) {
					this.throttle = false;
					this.searching = true; //loadding要显示
					this.suggests = []; //清空数组
					this.showsuggest = true; //显示搜索建议
					this.showresult = false; //隐藏搜索结果
					this.$http
						.get("/search/suggest?keywords=" + v)
						.then((data) => {
							if (data.data.code == 200) {
								let result = data.data.result;
								if (result.order) {
									//  归集,根据order里的分类了,取到数据里的分类的数据
									let re = result.order.reduce((prev, v) => {
										// 根据分类去re里取到数据数组
										let rev = result[v];
										// 连接和上一个数据成数组
										return prev.concat(rev);
									}, []); //[]第一项的值
									// 裁切6个
									this.suggests = re.slice(0, 8);
									this.searching = false; //获取成功loadding隐藏
								}
							}
						})
						.finally(() => {
							//找不到或者返回错误编码取消loading
							this.searching = false;
						});
					if (this.inpval == "") {
						//判断如果搜索的字词已经全部删除为空.
						this.suggests = [];
						this.showsuggest = false; //隐藏搜索提示
					}

					setTimeout(() => {
						this.throttle = true;
					}, 1000)

				} else {
					this.inpflag = true; //打开input监听
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	.box {
		width: 100%;
		background: #FFFFFF;

		.searchbox {
			height: 70px;
			background: white;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #eee;

			.search {
				flex: 1;
				position: relative;
				margin-right: 20px;
				line-height: 36px;
				color: #333;

				.icon-sousuo {
					position: absolute;
					left: 20px;
					font-size: 20px;
					color: #E91E63;
				}

				.icon-quxiao1 {
					position: absolute;
					right: 10px;
					font-size: 25px;
					color: #aaa;
				}

				input {
					width: 100%;
					height: 36px;
					border: none;
					font-size: 16px;
					background: #ebecec;
					border-radius: 30px;
					text-indent: 50px;
					outline: none;
					color: #666;
				}
			}

			.icon-left {
				display: inline-block;
				width: 35px;
				font-size: 25px;
				margin-left: 10px;
				margin-right: 15px;
				text-align: center;
				color: #666;
			}

			.icon-caidan {
				font-size: 35px;
			}
		}

		.hotsearch {
			margin-left: 10px;
			text-align: left;

			span {
				font-weight: 400;
				line-height: 40px;
				color: #333;
				font-size: 20px;
			}

			ul {
				display: flex;
				flex-wrap: wrap;
			}

			ul li {
				width: 50%;
				list-style: none;
				height: 30px;
				line-height: 30px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 14px;

				.num {
					display: inline-block;
					width: 30px;
					height: 30px;
					text-align: center;
				}

				&:nth-of-type(1) {
					font-weight: 700;

					.num {
						color: red;
					}
				}

				&:nth-of-type(2) {
					font-weight: 700;

					.num {
						color: red;
					}
				}

				&:nth-of-type(3) {
					font-weight: 700;

					.num {
						color: red;
					}
				}

				.hot {
					margin-left: 4px;
					font-weight: 400;
					font-size: 13px;
					color: red;
				}
			}
		}

		.searchHistory {
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 10px;
			}

			.cell {
				// display: flex;
				// align-items: center;
				// justify-content: space-between;
				padding: 5px 10px;
				font-size: 14px;
				color: #aaa;

				&>div {
					padding: 5px 7px;
					margin: 5px;
					border: 1px solid #aaa;
					border-radius: 10px;
					// background-color: #F7F8FA;
				}
			}
		}

		.suggestbox {
			ul {
				text-align: left;
				margin-left: 10px;
			}

			li {
				height: 40px;
				line-height: 40px;
				border-bottom: 1px solid #eee;
				font-size: 16px;

				&.selfinput {
					color: #E91E63;
				}

				.icon-sousuo {
					font-size: 18px;
					color: #ebecec;
					margin-right: 10px;
				}
			}
		}
	}
</style>
