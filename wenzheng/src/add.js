const API_URL = 'http://test.sogx.cn'
const vm = new Vue({
    el: '#root',
    data: {
        ym_id: location.href.split('?')[1].split('&')[0].split('=')[1],
        typeList: [{
            id: 0,
            name: '选择分类'
        }],
        typeid: location.href.split('?')[1].split('&')[1].split('=')[1],
        branchList: [{
            id: 0,
            name: '选择部门'
        }],
        adminId: location.href.split('?')[1].split('&')[2].split('=')[1],
        images: '',
        video: '',
        lng: '',
        lat: '',
        locate: ''
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
            payload.append('locate', this.locate)
            payload.append('ym_id', this.ym_id)
            if (!payload.get('title')) {
                layer.msg('请输入标题');
            } else if (payload.get('typeid') == 0) {
                layer.msg('请选择分类');
            } else if (payload.get('adminId') == 0) {
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
                const options = {
                    method: 'POST',
                    body: payload
                }
                fetch(API_URL + '/api/guestbook/add', options)
                    .then(response => response.json())
                    .then(json => {
                        if (json.msg == '未登录') { // go to login page
                            layer.msg(json.msg)
                            setTimeout(() => top.location.href = 'login.html?appid=' + this.ym_id, 300)
                        } else if (json.msg == '问政内容不能为空') {
                            layer.msg('请输入内容')
                        } else if (json.msg == '标题必须是3-50个字符') {
                            layer.msg(json.msg)
                        } else if (json.msg == '添加成功，等待管理员审核') { // go back to home page
                            layer.msg('问政成功')
                            setTimeout(() => history.go(-1), 300)
                        } else { // reload the page
                            layer.msg('爆料失败')
                            setTimeout(() => location.reload(), 300)
                        }
                    })
                payload.append('lng', this.lng)
                payload.append('lat', this.lat)
            }
        },
        uploadImage() {
            const data = new FormData()
            data.append('appid', this.ym_id)
            data.append('file', new FormData(document.getElementById('form')).get('images'))
            const options = {
                method: 'POST',
                body: data
            }
            fetch(API_URL + '/api/common/uploadImage', options)
                .then(response => response.json())
                .then(json => {
                    layer.msg(json.msg)
                    if (json.msg == '上传成功') { // image is uploaded successfully
                        if (this.images) this.images += ',' + json.data.url
                        else this.images = json.data.url

                        // add the image preview
                        const img = document.createElement('img')
                        img.src = json.data.url
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
            const options = {
                method: 'POST',
                body: data
            }
            fetch(API_URL + '/api/common/uploadVideo', options)
                .then(response => response.json())
                .then(json => {
                    layer.msg(json.msg)
                    if (json.msg == '上传成功') { // video is uploaded successfully
                        this.video = json.data.url
                        const add = document.getElementsByClassName('add')[1]
                        const input = document.getElementsByName('video')[0]
                        input.style.display = 'none'
                        add.style.background = 'black'

                        // add the video preview
                        const video = document.createElement('video')
                        video.src = json.data.url
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
        },
        getLocation() {
            // get current coordinates
            const geolocation = new BMap.Geolocation()
            geolocation.enableSDKLocation()
            geolocation.getCurrentPosition((result) => {
                this.lng = result.longitude
                this.lat = result.latitude

                // get location from the coordinates
                const point = new BMap.Point(this.lng, this.lat)
                const geoc = new BMap.Geocoder()
                geoc.getLocation(point, (result) => {
                    this.locate = result.address
                })
            })
        },
    },
    created() {
        this.getBranchList()
        this.getTypeList()
        this.getLocation()
    }
})