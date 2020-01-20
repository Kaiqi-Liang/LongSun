const API_URL = 'http://test.sogx.cn'
const vm = new Vue({
    el: '#root',
    data: {
        API_URL: 'http://v.sogx.cn',
        id: location.href.split('?')[1].split('&')[0].split('=')[1],
        ym_id: location.href.split('?')[1].split('&')[1].split('=')[1],
        zwh_id: '',
        title: '',
        unit: '',
        service: '',
        address: '',
        window: '',
        tel: '',
        base: [],
        materials: [],
        notice: '',
        condition: '',
        flowcharts: [],
        imgUrl: ''
    },
    methods: {
        getData() {
            fetch(this.API_URL + '/api/zwfw/project_detail/ym_id/' + this.ym_id + '/id/' + this.id)
                .then(response => response.json())
                .then(json => {
                    this.title = json.data.maininfo.title
                    this.unit = json.data.maininfo.zwh_jbxx_sszt
                    this.service = json.data.maininfo.zwh_jbxx_dxccs
                    this.address = json.data.maininfo.zwh_jbxx_bldd
                    this.window = json.data.maininfo.zwh_kzxx_ckmc
                    this.tel = json.data.maininfo.zwh_kzxx_ckdh
                    this.zwh_id = json.data.maininfo.zwh_id

                    json.data.meterial.forEach(material => {
                        if (material.templateLinks[1]) {
                            this.materials.push({
                                name: material.name,
                                count: material.count,
                                must: material.must,
                                templateLink: material.templateLinks[1].href
                            })
                        } else {
                            this.materials.push({
                                name: material.name,
                                count: material.count,
                                must: material.must,
                                templateLink: ''
                            })
                        }
                    })

                    this.base = json.data.base
                    this.notice = json.data.notice
                    this.condition = json.data.condition

                    json.data.flowchart.forEach(flowchart => {
                        this.flowcharts.push(flowchart)
                    })

                    // add title on scroll
                    document.body.onscroll = () => {
                        const header = document.getElementById('header')
                        const title = document.getElementById('title')
                        if (title) { // title already exists
                            if ((document.documentElement.scrollTop || document.body.scrollTop) == 0) {
                                header.removeChild(title)
                            }
                        } else {
                            const span = document.createElement('span')
                            span.innerText = this.title
                            span.setAttribute('id', 'title')
                            header.appendChild(span)
                        }
                    }

                    // create events for switching categories
                    const categories = document.getElementsByClassName('category')
                    for (let category = 0; category < categories.length; category++) {
                        categories[category].addEventListener('click', () => {
                            if (categories[category].className != 'category active') { // the onclick category is not active
                                // add a class active to activate it
                                categories[category].className = 'category active'
                                // deactivate every other category
                                for (let i = 0; i < categories.length; i++) {
                                    if (category != i) {
                                        categories[i].className = 'category'
                                    }
                                }

                                // hide all the sections
                                for (let section of document.getElementsByName('section')) {
                                    section.style.display = 'none'
                                }

                                // show the corresponding section to the onclick category
                                if (categories[category].innerText === '办事信息') {
                                    document.getElementById('base').style.display = "block"
                                } else if (categories[category].innerText === '需交材料') {
                                    document.getElementById('material').style.display = "block"
                                } else if (categories[category].innerText === '注意事项') {
                                    document.getElementById('notice').style.display = "block"
                                } else if (categories[category].innerText === '审批条件') {
                                    document.getElementById('condition').style.display = "block"
                                } else if (categories[category].innerText === '流程图') {
                                    document.getElementById('flowchart').style.display = "block"
                                }
                            }
                        })
                    }
                    this.setupSharing()
                })
        },
        getLogo() {
            fetch(API_URL + '/api/app/logo/appid/' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    this.imgUrl = json.data
                })
        },
        favourite() {
            layer.msg('该功能暂未开发!', { icon: 5, offset: ['80%'] })
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
                            desc: '', // 分享描述
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        });

                        wx.onMenuShareTimeline({ //例如分享到朋友圈的API
                            title: this.title, // 分享标题
                            link: location.href, // 分享链接
                            imgUrl: this.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        });

                        wx.onMenuShareQQ({
                            title: this.title, // 分享标题
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
        this.getData()
        this.getLogo()
    }
})