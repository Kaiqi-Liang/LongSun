/*
data = [fetch('http://v.sogx.cn/api/zwfw/project_list_new/ym_id/48/classifyType/39/page/1'),
        //fetch('http://v.sogx.cn/api/zwfw/project_detail/ym_id/48/id/1230'),
        fetch('http://v.sogx.cn/api/zwfw/classify_list/ym_id/48/type/3')]
Promise.all(data)
    .then(responses => responses.map(response => response.json()))
    .then(jsons => {
        console.log(jsons)
    })
*/

new Vue({
    el: '#root',
    data: {
        id: window.location.href.split("?")[1].split('&&')[0].split('=')[1],
        name: decodeURI(window.location.href.split("?")[1].split('&&')[1].split('=')[1]),
        type: decodeURI(window.location.href.split("?")[1].split('&&')[2].split('=')[1]),
        page: 1,
        projectList: [],
        footer: 'Loading...'
    },
    methods: {
        getData() {
            if (this.type === 'icon') path = 'http://v.sogx.cn/api/zwfw/project_list_new/ym_id/48/classifyType/' + this.id + '/page/' + this.page 
            else if (this.type === 'list') path = 'http://v.sogx.cn/api/zwfw/project_list_new/ym_id/48/dept_id/' + this.id + '/page/' + this.page 
            axios.get(path)
                .then(response => response.data.data)
                .then(data => {
                    if (data.projectList) {
                        if (data.projectList.length < 20) { // last fetch
                            this.noMoreData()
                        }
                        data.projectList.forEach(item => {
                            this.projectList.push({
                                id: item.id,
                                title: item.zwh_title_bt,
                                service: item.zwh_jbxx_dxccs
                            })
                        })
                    } else { // nothing is fetched
                        this.noMoreData()
                    }
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
                this.getData()
            }
        },
        noMoreData() {
            this.footer = 'No more data.'
        }
    },
    created() {
        this.getData();
        window.addEventListener('scroll', this.onScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll);
    }
})