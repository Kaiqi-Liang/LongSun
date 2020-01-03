const app = new Vue({
    el: '#root',
    data() {
        return {
            ym_id: location.href.split('?')[1].split('=')[1],
            typeList: [],
            branchList: []
        }
    },
    methods: {
        getTypeList() {
            fetch('http://www.sogx.cn/api/guestbook/typeList?ym_id=' + this.ym_id)
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
            fetch('http://www.sogx.cn/api/guestbook/branchList?ym_id=' + this.ym_id)
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
            const input = document.getElementsByTagName('input')
            const select = document.getElementsByTagName('select')
            const payload = {
                'ym_id': this.ym_id,
                'title': input[0].value,
                'typeid': select[0].value,
                'adminid': select[1].value,
                'introduce': document.querySelector('textarea').value,
                'video': input[1].value,
                'images': input[2].value
            }
            if (payload.title == '') {
                layer.msg('请输入标题');
            } else if (payload.typeid == 0) {
                layer.msg('请选择分类');
            } else if (payload.adminid == 0) {
                layer.msg('请选择部门');
            } else {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                }
                fetch('http://www.sogx.cn/api/guestbook/add', options)
                    .then(response => response.json())
                    .then(json => {
                        console.log(json)
                        if (json.msg == '未登录') {
                            window.location.href = 'login.html?appid=' + this.ym_id
                        } else if (json.msg == '问政内容不能为空') {
                            layer.msg('请输入内容');
                        } else if (json.msg == '标题必须是3-50个字符') {
                            layer.msg(json.msg)
                        }
                    })
            }

        }
    },
    created() {
        this.getBranchList()
        this.getTypeList()
    }
})