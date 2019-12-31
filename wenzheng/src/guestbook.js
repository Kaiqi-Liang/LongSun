new Vue({
    el: '#root',
    data: {
        ym_id: location.href.split('?')[1].split('=')[1],
        bmcount: '',
        replycount: '',
        classes: [],
        list: [],
        footer: 'Loading...'
    },
    methods: {
        getCount() {
            fetch('http://www.sogx.cn/api/guestbook/getCount?ym_id=' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    this.bmcount = json.data.bmcount
                    this.replycount = json.data.replycount
                })
        },
        getClassify() {
            fetch('http://www.sogx.cn/api/guestbook/typeList?ym_id=' + this.ym_id)
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

            const classify = document.getElementsByClassName('classify')[0]
            classify.addEventListener('click', () => {
                // show the classify modal
                document.getElementsByClassName('modal')[0].style.display = 'block'
            })
        },
        changeClassify(id, name) {
            // change the classify name
            document.getElementById('classify').innerText = name

            const ticks = document.getElementsByClassName('tick')
            for (let tick  = 0; tick < ticks.length; tick++) {
                if (ticks[tick].src.indexOf('grey_tick.png') != -1) { // the tick is grey
                    if (tick == id) { // if the tick is clicked
                        ticks[tick].src = 'images/green_tick.png'
                        // clear out list
                        this.list = []

                        // more data to load
                        this.footer = 'Loading...'
                        const rotate = document.createElement('img')
                        rotate.setAttribute('id', 'rotate')
                        rotate.setAttribute('src', 'images/rotate.gif')
                        document.getElementsByClassName('footer')[0].appendChild(rotate)
                        // reload list
                        this.getList(id, 10, true)
                    }
                } else { // the tick is green
                    if (tick != id) { // if the tick not clicked
                        ticks[tick].src = 'images/grey_tick.png'
                    }
                }
            }
        },
        getList(type_id, pagesize, first) {
            fetch('http://www.sogx.cn/api/guestbook/list?ym_id=' + this.ym_id + '&&typeid=' + type_id + "&&pagesize=" + pagesize)
                .then(response => response.json())
                .then(json => {
                    if(first) this.renderList(json.data, pagesize)
                    else setTimeout(() => this.renderList(json.data, pagesize), 200)
                })
        },
        renderList(json, pagesize) {
            if (json) {
                if (json.length < pagesize) this.noMoreData()
                json.forEach(data => {
                    this.list.push({
                        id: data.id,
                        username: data.username,
                        time: this.formatDate(data.addtime),
                        status: this.status,
                        intro: data.introduce,
                        name: data.name,
                        comments: data.commentcount,
                        likes: data.likes,
                        avatar: data.avatar
                    })
                })
            } else {
                this.noMoreData()
            }
        },
        noMoreData() {
            this.footer = 'The end.'
            // remove the loading gif
            document.getElementsByClassName('footer')[0].removeChild(document.getElementById('rotate'))
        },
        formatDate(time) {
            const date = new Date(time * 1000)
            return date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
        },
        hideModal() {
            document.getElementsByClassName('modal')[0].style.display = 'none'
        }
    },
    created() {
        this.getCount()
        this.getList(0, 10, true)
        new Promise((resolve) => {
            resolve()
        }).then(() => this.getClassify())
        //.then(() => {
        //    console.log(document.getElementsByTagName('h3')[0])
        //    document.getElementsByTagName('h3')[0].removeEventListener('click', this.hideModal())
        //})
    },
})