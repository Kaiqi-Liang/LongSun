const API_URL = 'http://www.sogx.cn'
new Vue({
    el: '#root',
    data: {
        ym_id: location.href.split('?')[1].split('=')[1],
        typeList: [],
        branchList: [],
        images: '',
        video: ''
    },
    methods: {
        getTypeList() {
            fetch(API_URL + '/api/guestbook/typeList?ym_id=' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    json.data.forEach(data => {
                        this.typeList.push({
                            id: data.id,
                            name: data.name
                        })
                    })
                })
        },
        getBranchList() {
            fetch(API_URL + '/api/guestbook/branchList?ym_id=' + this.ym_id)
                .then(response => response.json())
                .then(json => {
                    json.data.forEach(data => {
                        this.branchList.push({
                            id: data.id,
                            name: data.name
                        })
                    })
                })
        },
        submit() {
            const payload = new FormData(document.getElementById('form'))
            payload.append('ym_id', this.ym_id)
            if (!payload.get('title')) {
                layer.msg('请输入标题');
            } else if (payload.get('typeid') == 0) {
                layer.msg('请选择分类');
            } else if (payload.get('adminid') == 0) {
                layer.msg('请选择部门');
            } else {
                // there are images uploaded
                if (this.images) payload.set('images', this.images)
                // remove the images field
                else payload.delete('images')
                // there is a video uploaded
                if (this.video) payload.set('video', this.video)
                // remove the video field
                else payload.delete('video')
                axios.post(API_URL + '/api/guestbook/add', payload)
                    .then(response => {
                        if (response.data.msg == '未登录') { // go to login page
                            layer.msg(response.data.msg)
                            setTimeout(() => window.location.href = 'login.html?appid=' + this.ym_id, 300)
                        } else if (response.data.msg == '问政内容不能为空') {
                            layer.msg('请输入内容')
                        } else if (response.data.msg == '标题必须是3-50个字符') {
                            layer.msg(response.data.msg)
                        } else if (response.data.msg == '添加成功，等待管理员审核') { // go back to home page
                            layer.msg('问政成功')
                            setTimeout(() => window.location.href = 'guestbook.html?ym_id=' + this.ym_id, 300)
                        } else { // reload the page
                            layer.msg('爆料失败')
                            setTimeout(() => location.reload(), 300)
                        }
                    })
            }
        },
        uploadImage() {
            const data = new FormData()
            data.append('appid', this.ym_id)
            data.append('file', new FormData(document.getElementById('form')).get('images'))
            axios.post(API_URL + '/api/common/uploadImage', data)
                .then(response => {
                    layer.msg(response.data.msg)
                    if (response.data.msg == '上传成功') { // image is uploaded successfully
                        if (this.images) this.images += ',' + response.data.data.url
                        else this.images = response.data.data.url

                        // add the image preview
                        const img = document.createElement('img')
                        img.src = response.data.data.url
                        img.className = 'preview'

                        const div = document.createElement('div')
                        div.className = 'image'
                        div.appendChild(img)

                        const images = document.querySelector('#images')
                        images.appendChild(div)

                        div.addEventListener('click', () => {
                            layer.open({
                                content: '确认删除吗？',
                                btn: ['确定', '取消'],
                                yes: (index) => {
                                    // close the popup
                                    layer.close(index)
                                    // remove the image
                                    images.removeChild(div)
                                }
                            })
                        })
                    }
                })
                // reset the value to allow selecting the same image
                document.getElementsByName('images')[0].value = ''
        },
        uploadVideo() {
            const data = new FormData()
            data.append('appid', this.ym_id)
            data.append('file', new FormData(document.getElementById('form')).get('video'))
            axios.post(API_URL + '/api/common/uploadVideo', data)
                .then(response => {
                    layer.msg(response.data.msg)
                    if (response.data.msg == '上传成功') { // video is uploaded successfully
                        this.video = response.data.data.url
                        const add = document.getElementsByClassName('add')[1]
                        const input = document.getElementsByName('video')[0]
                        input.style.display = 'none'
                        add.style.background = 'black'

                        // add the video preview
                        const video = document.createElement('video')
                        video.src = response.data.data.url
                        video.className = 'preview'

                        const div = document.createElement('div')
                        div.style = 'text-align: center'
                        div.appendChild(video)
                        add.appendChild(div)

                        video.addEventListener('click', () => {
                            layer.open({
                                content: '确认删除吗？',
                                btn: ['确定', '取消'],
                                yes: (index) => {
                                    // close the popup
                                    layer.close(index)
                                    // remove the video
                                    add.removeChild(div)
                                    // reshow the plus icon
                                    add.style = 'background: url(images/upload.png) center; background-size: cover'
                                    // reshow the input file selection
                                    input.style.display = 'block'
                                }
                            })
                        })
                    }
                })
        }
    },
    created() {
        this.getBranchList()
        this.getTypeList()
    }
})