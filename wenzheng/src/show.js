new Vue({
    el: '#root',
    data: {
        id: location.href.split('?')[1].split('=')[1],
        title: '',
        username: '',
        avatar: '',
        addtime: '',
        typename: '',
        intro: '',
    },
    methods: {
        formatDate(time) {
            const date = new Date(time * 1000)
            return date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
        },
    },
    created () {
        fetch('http://www.sogx.cn/api/guestbook/show?id=' + this.id)
            .then(response => response.json())
            .then(json => {
                this.title = json.data.title
                this.username = json.data.username
                this.avatar = json.data.avatar
                this.addtime = this.formatDate(json.data.addtime)
                this.typename = this.typename
                this.intro = json.data.introduce
            })
    },
})