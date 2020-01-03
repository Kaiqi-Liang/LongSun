const app = new Vue({
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
        footer: '加载中...'
    }, methods: {
        getDetail() {
            fetch('http://www.sogx.cn/api/guestbook/show?ym_id=' + this.ym_id + '&&id=' + this.id)
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
            fetch('http://www.sogx.cn/api/guestbook/commentList?ym_id=' + this.ym_id + '&&rel_id=' + this.id + '&&page=' + this.page + '&&pagesize=' + this.pagesize)
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
            if (years > 0) {
                time = years + '年前';
            } else if (years === 0 && months > 0) {
                time = months + '月前';
            } else if (months === 0 && days > 0) {
                time = days + '天前';
            } else if (days === 0 && hours > 0) {
                time = hours + '小时前';
            } else if (hours === 0 && minutes > 0) {
                time = minutes + '分钟前';
            } else {
                time = seconds + '秒前';
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