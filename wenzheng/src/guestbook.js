const API_URL = 'http://test.sogx.cn'
const vm = new Vue({
    el: '#root',
    data: {
        ym_id: location.href.split('?')[1].split('=')[1],
        bmcount: '',
        replycount: '',
        classes: [],
        list: [],
        pagesize: 10,
        page: 1,
        footer: '加载中...',
        imgUrl: ''
    },
    methods: {
        getCount() {
            fetch(API_URL + '/api/guestbook/getCount?ym_id=' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    this.bmcount = json.data.bmcount
                    this.replycount = json.data.replycount
                })
        },
        getLogo() {
            fetch(API_URL + '/api/app/logo/appid/' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    this.imgUrl = json.data
                })
        },
        getClassify() {
            fetch(API_URL + '/api/guestbook/typeList?ym_id=' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    this.classes.push({
                        id: 0,
                        name: '全部分类'
                    })
                    json.data.forEach(data => {
                        this.classes.push({
                            id: data.id,
                            name: data.name
                        })
                    })
                })

            // show the classify modal on click
            const modal = document.querySelector('.modal')
            document.getElementById('arrow').addEventListener('click', () => {
                modal.style.display = 'block'
                setTimeout(() => modal.addEventListener('click', this.onHide), 0)
            })

            document.getElementById('classify').addEventListener('click', () => {
                modal.style.display = 'block'
                setTimeout(() => modal.addEventListener('click', this.onHide), 0)
            })
        },
        hideModal() {
            document.querySelector('.modal').style.display = 'none'
        },
        onHide(event) {
            // click anywhere outside of the modal content, the title in the content and the cancel button
            if (event.target != document.querySelector('.content') &&
                event.target != document.querySelector('h3')) {
                    this.hideModal()
                }
        },
        changeClassify(id, name) {
            // change the classify name
            document.getElementById('classify').innerText = name

            // change the colour of the tick
            const ticks = document.getElementsByClassName('tick')
            for (let tick = 0; tick < ticks.length; tick++) {
                if (ticks[tick].src.indexOf('tick_grey.png') != -1) { // the tick is grey
                    if (tick == id) { // if the tick is clicked
                        ticks[tick].src = 'images/tick_green.png'
                        // clear out list
                        this.list = []

                        // more data to load
                        this.footer = '加载中...'
                        document.getElementById('rotate').style.display = 'block'
                        // reset page to the first page
                        this.page = 1
                        // reload list
                        this.getList(id, true)
                    }
                } else { // the tick is green
                    if (tick != id) { // if the tick not clicked
                        ticks[tick].src = 'images/tick_grey.png'
                    }
                }
            }
        },
        getList(type_id, first) {
            fetch(API_URL + '/api/guestbook/list?ym_id=' + this.ym_id + '&typeid=' + type_id + '&page=' + this.page + '&pagesize=' + this.pagesize)
                .then(response => response.json())
                .then(json => {
                    if (first) this.renderList(json.data)
                    else setTimeout(() => this.renderList(json.data), 200)
                })
        },
        renderList(json) {
            if (json.length < this.pagesize) this.noMoreData()
            json.forEach(data => {
                this.list.push({
                    id: data.id,
                    username: data.username,
                    time: this.formatDate(data.addtime),
                    status: data.status,
                    intro: data.introduce,
                    name: data.name,
                    comments: data.commentcount,
                    likes: data.likes,
                    avatar: data.avatar
                })
            })
        },
        onScroll() {
            // overall scroll height
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            // current length between the top of the page and the scroll bar
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            // current height of the scroll bar
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
            if (scrollTop + clientHeight === scrollHeight) { // scrolled to the bottom
                // load the next page
                this.page++
                this.getList(0, false)
            }
        },
        noMoreData() {
            this.footer = '没有更多数据.'
            document.getElementById('rotate').style.display = 'none'
        },
        formatDate(time) {
            const date = new Date(time * 1000)
            const days = parseInt(date.getDate())
            const months = parseInt(date.getMonth() + 1)
            return date.getFullYear() + '-' + (months < 10 ? '0' + months : months) + '-' + (days < 10 ? '0' + days : days)
        },
        link(id) {
            if (id) aLinkClick('show.html?id=' + id + '&ym_id=' + this.ym_id)
            else aLinkClick('add.html?ym_id=' + this.ym_id + '&typeid=0&adminId=0')
        },
        setupSharing() {
            $.ajax({
                url: API_URL + '/api/app/getWechatSignPackage',
                type: 'get',
                data: { url: location.href },
                dataType: 'json',
                success: res => {
                    wx.config({
                        debug: false, //调式模式，设置为ture后会直接在网页上弹出调试信息，用于排查问题
                        appId: res.data.appId,
                        timestamp: res.data.timestamp,
                        nonceStr: res.data.nonceStr,
                        signature: res.data.signature,
                        jsApiList: [  //需要使用的网页服务接口
                            'checkJsApi',  //判断当前客户端版本是否支持指定JS接口
                            'onMenuShareTimeline', //分享给好友
                            'onMenuShareAppMessage', //分享到朋友圈
                            'onMenuShareQQ',  //分享到QQ
                            'onMenuShareWeibo' //分享到微博
                        ]
                    });
                    wx.ready(() => { //ready函数用于调用API，如果你的网页在加载后就需要自定义分享和回调功能，需要在此调用分享函数。//如果是微信游戏结束后，需要点击按钮触发得到分值后分享，这里就不需要调用API了，可以在按钮上绑定事件直接调用。因此，微信游戏由于大多需要用户先触发获取分值，此处请不要填写如下所示的分享API
                        wx.onMenuShareAppMessage({ //例如分享到朋友圈的API
                            title: '', // 分享标题
                            desc: '', // 分享描述
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        });

                        wx.onMenuShareTimeline({ //例如分享到朋友圈的API
                            title: '', // 分享标题
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        });

                        wx.onMenuShareQQ({
                            title: '', // 分享标题
                            desc: '', // 分享描述
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                    wx.error(function (res) {
                        alert(res.errMsg); //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
                    });
                }
            });
        }
    },
    created() {
        this.getCount()
        this.getLogo()
        this.setupSharing()
        this.getList(0, true)
        setTimeout(() => this.getClassify(), 0)
        window.addEventListener('scroll', this.onScroll)
    }
})