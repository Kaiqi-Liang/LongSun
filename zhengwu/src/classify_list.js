const API_URL_1 = 'http://v.sogx.cn'
const API_URL_2 = 'http://www.sogx.cn'
const API_URL_3 = 'http://test.sogx.cn'
const ym_id = location.href.split('?')[1].split('=')[1]
let imgUrl = ''
render(1)

const icons = document.getElementsByName('icon')
for (let icon = 0; icon < icons.length; icon++) {
    icons[icon].addEventListener('click', () => {
        if (icons[icon].src.indexOf('active') == -1) { // the onclick icon is not active
            // activate the onclick icon
            icons[icon].src = icons[icon].src.slice(0, icons[icon].src.lastIndexOf('.')) + '_active.png'

            for (let i = 0; i < icons.length; i++) { // loop through every other icon
                if (icon != i) {
                    if (icons[i].src.indexOf('active') >= 0) { // find the last active icon
                        // deactivate it
                        icons[i].src = icons[i].src.slice(0, icons[i].src.indexOf('_active')) + '.png'
                    }
                }
            }

            const main = document.getElementById('main')
            // clear the current list
            main.removeChild(document.getElementById('ul'))
            render(icon + 1)
        }
    })
}

fetch(API_URL_3 + '/api/app/logo/appid/' + ym_id)
    .then(response => response.json())
    .then(json => {
        imgUrl = json.data
        setupSharing()
    })

function setupSharing() {
    $.ajax({
        url: API_URL_3 + '/api/app/getWechatSignPackage',
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
                    imgUrl: imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                });

                wx.onMenuShareTimeline({ //例如分享到朋友圈的API
                    title: '', // 分享标题
                    link: location.href, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                });

                wx.onMenuShareQQ({
                    title: '', // 分享标题
                    desc: '', // 分享描述
                    link: location.href, // 分享链接
                    imgUrl: imgUrl, // 分享图标
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

function render(page) {
    const main = document.getElementById('main')
    const ul = document.createElement('ul')
    main.appendChild(ul)
    ul.setAttribute('id', 'ul')
    if (page == 4) {
        ul.style = "margin: 0"
        fetch(API_URL_2 + '/api/news/column/appid/' + ym_id + '/pid/' + 172)
            .then(response => response.json())
            .then(json => {
                for (data of json.data) {
                    const li = document.createElement('li')
                    ul.appendChild(li)

                    li.setAttribute('id', data.id)
                    li.className = "box"
                    const link = API_URL_2 + '/wap/news/list/appid/' + ym_id + '/columnid/' + data.id
                    li.onclick = () => aLinkClick(link)

                    const img = document.createElement('img')
                    img.setAttribute('src', API_URL_2 + data.icon)
                    img.style.width = '30%'
                    li.appendChild(img)

                    const p = document.createElement('p')
                    p.innerText = data.name
                    li.appendChild(p)
                }
            })
    } else {
        fetch(API_URL_1 + '/api/zwfw/classify_list/ym_id/' + ym_id + '/type/' + page)
            .then(response => response.json())
            .then(json => {
                for (data of json.data) {
                    if (data.imgurl) { // if there are icons
                        render_icons(data, 'project_list.html?id=' + data.id + '&ym_id=' + ym_id + '&name=' + data.name + '&type=icon')
                    } else {
                        render_list(data, 'project_list.html?id=' + data.id + '&ym_id=' + ym_id + '&name=' + data.name + '&type=list')
                    }
                }
            })
    }
}

function render_icons(data, link) {
    const li = document.createElement('li')
    ul.appendChild(li)

    li.className = "icon"
    li.setAttribute('id', data.id)
    li.onclick = () => aLinkClick(link)

    const img = document.createElement('img')
    img.setAttribute('src', API_URL_1 + data.imgurl)
    img.style.width = '30%'
    li.appendChild(img)

    const p = document.createElement('p')
    p.innerText = data.name
    p.style.cssText = "margin-top: 0%; margin-bottom: 30%;"
    li.appendChild(p)
}

function render_list(data, link) {
    const li = document.createElement('li')
    ul.appendChild(li)

    li.className = "text"
    li.setAttribute('id', data.id)
    li.onclick = () => aLinkClick(link)

    const hr = document.createElement('hr')
    hr.id = "line"
    ul.appendChild(hr)

    const p = document.createElement('p')
    p.innerText = data.name
    li.appendChild(p)
}