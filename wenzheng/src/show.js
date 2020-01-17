const API_URL = 'http://test.sogx.cn'
new Vue({
    el: '#root',
    data: {
        id: location.href.split('?')[1].split('&')[0].split('=')[1],
        ym_id: location.href.split('?')[1].split('&')[1].split('=')[1],
        title: '',
        username: '',
        avatar: '',
        addtime: '',
        typename: '',
        intro: '',
        name: '',
        status: '',
        reply: '',
        commentcount: '',
        comments: [],
        page: 1,
        pagesize: 10,
        footer: '加载中...',
        favourite: 'images/favourite.png'
    }, methods: {
        getDetail() {
            fetch(API_URL + '/api/guestbook/show?ym_id=' + this.ym_id + '&id=' + this.id)
                .then(response => response.json())
                .then(json => {
                    this.title = json.data.title
                    this.username = json.data.username
                    this.avatar = json.data.avatar
                    this.addtime = this.formatDate(json.data.addtime)
                    this.typename = json.data.typename
                    this.intro = json.data.introduce
                    this.name = json.data.name
                    this.status = json.data.status
                    this.reply = json.data.reply
                    this.commentcount = json.data.commentcount
                    this.setupSharing()
                })
        },
        getComments(first) {
            fetch(API_URL + '/api/guestbook/commentList?ym_id=' + this.ym_id + '&rel_id=' + this.id + '&page=' + this.page + '&pagesize=' + this.pagesize)
                .then(response => response.json())
                .then(json => {
                    if (first) this.renderComments(json.data)
                    else setTimeout(() => this.renderComments(json.data), 200)
                })
        },
        renderComments(json) {
            if (json.length > 0) {
                if (json.length < this.pagesize) this.noMoreData()
                json.forEach(data => {
                    this.comments.push({
                        id: data.id,
                        userId: data.userId,
                        content: data.content,
                        createtime: this.computeTime(data.create_time),
                        nickname: data.nickname,
                        avatar: data.avatar
                    })
                })
            } else { // nothing is fetched
                if (this.footer == '加载中...') {
                    this.noMoreData()
                }
            }
        },
        writeComment() {
            const modal = document.querySelector('.modal')
            modal.style.display = 'block'
            document.querySelector('.back').href = 'javascript: void(0)'

            // 2 areas that will hide the comment writing section
            document.querySelector('.back').addEventListener('click', () => { // the back icon
                this.hideComment()
            })
            setTimeout(() => { // the grey area
                modal.addEventListener('click', this.onHide)
            }, 0)
        },
        hideComment() {
            document.querySelector('.modal').style.display = 'none'
            setTimeout(() => document.querySelector('.back').href = 'javascript: history.go(-1)', 0)
        },
        onHide(event) {
            if (event.target != document.querySelector('.content') &&
                event.target != document.querySelector('.box') &&
                event.target != document.querySelector('.write') &&
                event.target != document.querySelector('.send') &&
                event.target != document.querySelector('button'))
                this.hideComment()
        },
        sendComment() {
            const payload = new FormData(document.querySelector('form'))
            payload.append('rel_id', this.id)
            payload.append('ym_id', this.ym_id)
            if (payload.get('content')) {
                const options = {
                    method: 'POST',
                    body: payload
                }
                fetch(API_URL + '/api/guestbook/addComment', options)
                    .then(response => response.json())
                    .then(json => {
                        if (json.msg == '评论成功，等待管理员审核') {
                            layer.msg('评论成功')
                            document.getElementsByName('content')[0].value = ''
                            this.hideComment()
                        }
                        else if (json.msg == '未登录') {
                            layer.msg(json.msg)
                            setTimeout(() => top.location.href = '../../wap/my/login/appid/' + this.ym_id, 300)
                        } else {
                            layer.msg('评论失败')
                            document.getElementsByName('content')[0].value = ''
                            this.hideComment()
                        }
                    })
            } else {
                layer.msg('请输入评论内容')
            }
        },
        refreshComment() {
            if (this.commentcount == 0) layer.msg('还没有评论。')
        },
        addFavourite() {
            if (this.favourite == 'images/favourite.png') {
                this.favourite = 'images/favourite_add.png'
                layer.msg('收藏成功')
            } else {
                this.favourite = 'images/favourite.png'
                layer.msg('取消收藏成功')
            }
        },
        share() {
            if (typeof WeixinJSBridge == "undefined") {
                alert("请先通过微信打开此页面再分享.");
            } else { // 在微信中打开的
                const modal = document.querySelector('.share')
                modal.style.display = 'block'
                modal.addEventListener('click', () => modal.style.display = 'none')
            }
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
                this.getComments(false)
            }
        },
        noMoreData() {
            this.footer = '没有更多数据.'
            // remove the loading gif
            const footer = document.querySelector('.footer')
            footer.removeChild(footer.firstChild)
        },
        formatDate(time) {
            const date = new Date(time * 1000)
            const days = parseInt(date.getDate())
            const months = parseInt(date.getMonth() + 1)
            return date.getFullYear() + '-' + (months < 10 ? '0' + months : months) + '-' + (days < 10 ? '0' + days : days)
        },
        computeTime(time) {
            const date = new Date(time * 1000)
            const now = new Date()

            const days = parseInt(now.getDate()) - parseInt(date.getDate());
            const hours = parseInt(now.getHours()) - parseInt(date.getHours());
            const minutes = parseInt(now.getMinutes()) - parseInt(date.getMinutes());
            const seconds = parseInt(now.getSeconds()) - parseInt(date.getSeconds());
            if (days > 7) {
                time = this.formatDate(time)
            } else if (days > 1) {
                time = days + '天前'
            } else if (days == 1) {
                time = '昨天'
            } else if (hours > 0) {
                time = hours + '小时前'
            } else if (minutes > 0) {
                time = minutes + '分钟前'
            } else {
                time = seconds + '秒前'
            }
            return time
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
                            title: this.title, // 分享标题
                            desc: this.intro, // 分享描述
                            link: location.href, // 分享链接
                            imgUrl: API_URL + '/assets/img/yum_logo.png', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () { // 用户确认分享后执行的回调函数
                                document.querySelector('.share').style.display = 'none'
                            },
                        });

                        wx.onMenuShareTimeline({ //例如分享到朋友圈的API
                            title: this.title, // 分享标题
                            link: location.href, // 分享链接
                            imgUrl: API_URL + '/assets/img/yum_logo.png', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () { // 用户确认分享后执行的回调函数
                                document.querySelector('.share').style.display = 'none'
                            },
                        });

                        wx.onMenuShareQQ({
                            title: this.title, // 分享标题
                            desc: this.intro, // 分享描述
                            link: location.href, // 分享链接
                            imgUrl: API_URL + '/assets/img/yum_logo.png', // 分享图标
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
        this.getDetail()
        this.getComments(true)
        window.addEventListener('scroll', this.onScroll);
    },
})