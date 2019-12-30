new Vue({
    el: '#root',
    data: {
        ym_id: location.href.split('?')[1].split('=')[1],
        bmcount: '',
        replycount: '',
        list: []
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
            const classify = document.getElementsByClassName('classify')[0]
            classify.addEventListener('click', () => {
                document.getElementById('modal').style.display = 'block'
            })
        },
        getList() {
            fetch('http://www.sogx.cn/api/guestbook/list?ym_id=' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    json.data.forEach(data => {
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
                })
        },
        formatDate(time) {
            const date = new Date(time * 1000)
            return date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
        }
    },
    created() {
        this.getCount()
        this.getList()
        new Promise((resolve) => {
            resolve()
        }).then(() => this.getClassify())
    },
})