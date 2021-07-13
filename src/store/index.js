import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		musicID: 0,
		isPlay: false,
		musicIndex: 0,
		musicList: [],
		musicShow: false,
		mvID: 0,
		isMV: false,
		mvIndex: 0,
		mvList: [],
		enMV: false,
		likeMusic: [],
		playHistory:[],
	},
	mutations: {
		changemusicID(state, id) {
			state.musicID = id;
		},
		changeplaystatus(state, bool) {
			state.isPlay = bool;
		},
		changemusicIndex(state, index) {
			state.musicIndex = index;
		},
		changemusicList(state, list) {
			state.musicList = list;
		},
		isMusicShow(state, bool) {
			state.musicShow = bool;
		},
		changemvID(state, id) {
			state.mvID = id;
		},
		changemvstatus(state, bool) {
			state.isMV = bool;
		},
		changemvIndex(state, index) {
			state.mvIndex = index;
		},
		changemvList(state, list) {
			state.mvList = list;
		},
		isEnMV(state, bool) {
			state.enMV = bool;
		},
		changeLikeMusic(state, likeMusic) {
			state.likeMusic = likeMusic;
		},
		changePlayHistory(state,playHistory){
			state.playHistory = playHistory;
		}
	},
	actions: {},
	modules: {}
})
