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
        footer: '加载中...'
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
    },
    created() {
        this.getCount()
        this.getList(0, true)
        setTimeout(() => this.getClassify(), 0);
        window.addEventListener('scroll', this.onScroll);
    },
})