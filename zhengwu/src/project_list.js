const API_URL_1 = 'http://v.sogx.cn'
const API_URL_2 = 'http://test.sogx.cn'
const vm = new Vue({
    el: '#root',
    data: {
        // href = project_list.html?id=int&ym_id=48&name=str&type=(icon|list)
        id: location.href.split("?")[1].split('&')[0].split('=')[1],
        ym_id: location.href.split("?")[1].split('&')[1].split('=')[1],
        name: decodeURI(window.location.href.split("?")[1].split('&')[2].split('=')[1]),
        type: location.href.split("?")[1].split('&')[3].split('=')[1],
        page: 1,
        projectList: [],
        footer: '加载中...',
        imgUrl: ''
    },
    methods: {
        getLogo() {
            fetch(API_URL_2 + '/api/app/logo/appid/' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    this.imgUrl = json.data
                    this.setupSharing()
                })
        },
        getData(first) {
            if (this.type === 'icon') {
                path = API_URL_1 + '/api/zwfw/project_list_new/ym_id/' + this.ym_id + '/classifyType/' + this.id + '/page/' + this.page 
            } else {
                path = API_URL_1 + '/api/zwfw/project_list_new/ym_id/' + this.ym_id + '/dept_id/' + this.id + '/page/' + this.page 
            }

            fetch(path)
                .then(response => response.json())
                .then(json => {
                    if (first) { // fetching it for the first time
                        if (json.data == '') { // no data at all
                            const footer = document.querySelector('.footer')
                            footer.className = 'exclamation'
                            const children = footer.children
                            children[1].innerText = '暂无内容'
                            children[0].setAttribute('src', 'images/exclamation.png')
                            children[0].style = "width: unset; height: unset;"
                        } else {
                            this.processData(json.data)
                        }
                    } else { // show a bit of delay
                        setTimeout(() => this.processData(json.data), 200)
                    }
                    this.getLogo()
                })
        },
        processData(data) {
            if (data.projectList) {
                if (data.projectList.length < 20) { // last fetch
                    this.noMoreData()
                }
                data.projectList.forEach(item => {
                    this.projectList.push({
                        id: item.id,
                        title: item.zwh_title_bt,
                        service: item.zwh_jbxx_dxccs,
                        zwh_id: item.zwh_id
                    })
                })
            } else { // nothing is fetched
                if (this.footer == '加载中...') { // the last fetch fetched 20 items
                    this.noMoreData()
                }
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
                this.getData(false)
            }
        },
        noMoreData() {
            this.footer = '没有更多数据.'
            // remove the loading gif
            const footer = document.querySelector('.footer')
            footer.removeChild(footer.firstChild)
        },
        link(id) {
            aLinkClick('project_detail.html?id=' + id + '&ym_id=' + this.ym_id)
        },
        advisory(id) {
            this.projectList.forEach(item => {
                if (item.id == id) top.location.href = '../wenzheng/add.html?ym_id=' + this.ym_id + '&typeid=' + 1 + '&adminId=' + item.zwh_id
            })
        },
        setupSharing() {
            $.ajax({
                url: API_URL_2 + '/api/app/getWechatSignPackage',
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
                            title: this.name, // 分享标题
                            desc: '', // 分享描述
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        });

                        wx.onMenuShareTimeline({ //例如分享到朋友圈的API
                            title: this.name, // 分享标题
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        });

                        wx.onMenuShareQQ({
                            title: this.name, // 分享标题
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
        this.getData(true)
        window.addEventListener('scroll', this.onScroll)
    }
})