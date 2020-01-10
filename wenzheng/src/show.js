const API_URL = 'https://www.sogx.cn'
new Vue({
    el: '#root',
    data: {
        id: location.href.split('?')[1].split('&&')[0].split('=')[1],
        ym_id: location.href.split('?')[1].split('&&')[1].split('=')[1],
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
            fetch(API_URL + '/api/guestbook/show?ym_id=' + this.ym_id + '&&id=' + this.id)
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
                })
        },
        getComments(first) {
            fetch(API_URL + '/api/guestbook/commentList?ym_id=' + this.ym_id + '&&rel_id=' + this.id + '&&page=' + this.page + '&&pagesize=' + this.pagesize)
                .then(response => response.json())
                .then(json => {
                    if(first) this.renderComments(json.data)
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
            document.querySelector('.modal').style.display = 'block'
            document.querySelector('.back').href = 'javascript: void(0)'

            // 2 areas that will hide the comment writing section
            document.querySelector('.back').addEventListener('click', () => { // the back icon
                this.hideComment()
            })
            setTimeout(() => { // the grey area
                window.addEventListener('click', this.onHide)
            }, 0)
        },
        hideComment() {
            document.querySelector('.modal').style.display = 'none'
            setTimeout(() => document.querySelector('.back').href = 'javascript: history.go(-1)', 0)
            window.removeEventListener('click', this.onHide)
        },
        onHide(event) {
            if (event.target != document.querySelector('.content') &&
                event.target != document.querySelector('.box') &&
                event.target != document.querySelector('.write') &&
                event.target != document.querySelector('.send') &&
                event.target != document.querySelector('button') &&
                event.target != document.querySelector('.header') &&
                event.target != document.querySelector('.title'))
                this.hideComment()
        },
        sendComment() {
            const payload = new FormData(document.querySelector('form'))
            payload.append('rel_id', this.id)
            payload.append('ym_id', this.ym_id)
            if (payload.get('content')) {
                axios.post(API_URL + '/api/guestbook/addComment', payload)
                    .then(response => {
                        if (response.data.msg == '评论成功，等待管理员审核') {
                            layer.msg('评论成功')
                            document.getElementsByName('content')[0].value = ''
                            this.hideComment()
                        }
                        else if (response.data.msg == '未登录') {
                            layer.msg(response.data.msg)
                            setTimeout(() => window.location.href = 'login.html?appid=' + this.ym_id, 300)
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
            document.querySelector('.end').removeChild(document.getElementById('rotate'))
        },
        formatDate(time) {
            const date = new Date(time * 1000)
            return date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
        },
        computeTime(time) {
            const date = new Date(time * 1000)
            const now = new Date()

            const years = parseInt(now.getYear()) - parseInt(date.getYear());
            const months = parseInt(now.getMonth()) - parseInt(date.getMonth());
            const days = parseInt(now.getDate()) - parseInt(date.getDate());
            const hours = parseInt(now.getHours()) - parseInt(date.getHours());
            const minutes = parseInt(now.getMinutes()) - parseInt(date.getMinutes());
            const seconds = parseInt(now.getSeconds()) - parseInt(date.getSeconds());
            if (years === 1) {
                time = '去年';
            } else if (years === 0 && months > 1) {
                time = months + '月前';
            } else if (months === 1) {
                time = '上个月';
            } else if (months === 0 && days > 1) {
                time = days + '天前';
            } else if (days === 1) {
                time = '昨天';
            } else if (days === 0 && hours > 0) {
                time = hours + '小时前';
            } else if (hours === 0 && minutes > 0) {
                time = minutes + '分钟前';
            } else if (minutes === 0 && seconds > 0) {
                time = seconds + '秒前';
            } else {
                time = years + '年前';
            }
            return time
        }
    },
    created() {
        this.getDetail()
        this.getComments(true)
        window.addEventListener('scroll', this.onScroll);
    },
})