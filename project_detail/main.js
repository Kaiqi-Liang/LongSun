/*
data = [fetch('http://v.sogx.cn/api/zwfw/classify_list/ym_id/48/type/1'),
        fetch('http://v.sogx.cn/api/zwfw/project_list_new/ym_id/48/classifyType/15/page/1'),
        fetch('http://v.sogx.cn/api/zwfw/project_detail/ym_id/48/id/1218')]
Promise.all(data)
    .then(responses => responses.map(response => response.json()))
    .then(jsons => {
        console.log(jsons)
    })
*/

new Vue({
    el: '#root',
    data: {
        id: window.location.href.split('?')[1].split('=')[1],
        title: '',
        unit: '',
        service: '',
        address: '',
        window: '',
        base: []
    },
    created() {
        axios.get('http://v.sogx.cn/api/zwfw/project_detail/ym_id/48/id/' + this.id)
            .then(response => response.data.data)
            .then(data => {
                console.log(data)
                this.title = data.maininfo.title
                this.unit = data.maininfo.zwh_jbxx_sszt
                this.service = data.maininfo.zwh_jbxx_dxccs
                this.address = data.maininfo.zwh_jbxx_bldd
                this.window = data.maininfo.zwh_kzxx_ckmc

                data.base.forEach(base => {
                    this.base.push({
                        text: base.text,
                        value: base.value
                    })
                    console.log(base)
                })
            })
    }
})