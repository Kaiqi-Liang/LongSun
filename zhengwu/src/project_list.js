const API_URL = 'http://v.sogx.cn'
const vm = new Vue({
    el: '#root',
    data: {
        // href = project_list.html?id=int&ym_id=48&name=str&type=(icon|list)
        id: location.href.split("?")[1].split('&')[0].split('=')[1],
        ym_id: location.href.split("?")[1].split('&')[1].split('=')[1],
        name: decodeURI(window.location.href.split("?")[1].split('&')[2].split('=')[1]),
        type: location.href.split("?")[1].split('&')[3].split('=')[1],
        page: 1,
        projectList: [],
        footer: '加载中...'
    },
    methods: {
        getData(first) {
            if (this.type === 'icon') {
                path = API_URL + '/api/zwfw/project_list_new/ym_id/' + this.ym_id + '/classifyType/' + this.id + '/page/' + this.page 
            } else {
                path = API_URL + '/api/zwfw/project_list_new/ym_id/' + this.ym_id + '/dept_id/' + this.id + '/page/' + this.page 
            }

            fetch(path)
                .then(response => response.json())
                .then(json => {
                    if (first) { // fetching it for the first time
                        if (json.data == '') { // no data at all
                            const footer = document.querySelector('.footer')
                            footer.className = 'exclamation'
                            const children = footer.children
                            children[1].innerText = '暂无内容'
                            children[0].setAttribute('src', 'images/exclamation.png')
                            children[0].style = "width: unset; height: unset;"
                        } else {
                            this.processData(json.data)
                        }
                    } else { // show a bit of delay
                        setTimeout(() => this.processData(json.data), 200)
                    }
                })
        },
        processData(data) {
            if (data.projectList) {
                if (data.projectList.length < 20) { // last fetch
                    this.noMoreData()
                }
                data.projectList.forEach(item => {
                    this.projectList.push({
                        id: item.id,
                        title: item.zwh_title_bt,
                        service: item.zwh_jbxx_dxccs,
                        zwh_id: item.zwh_id
                    })
                })
            } else { // nothing is fetched
                if (this.footer == '加载中...') { // the last fetch fetched 20 items
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
                this.getData(false)
            }
        },
        noMoreData() {
            this.footer = '没有更多数据.'
            // remove the loading gif
            const footer = document.querySelector('.footer')
            footer.removeChild(footer.firstChild)
        },
        link(id) {
            top.location.href = 'project_detail.html?id=' + id + '&ym_id=' + this.ym_id
        },
        advisory(id) {
            this.projectList.forEach(item => {
                if (item.id == id) top.location.href = '../wenzheng/add.html?ym_id=' + this.ym_id + '&typeid=' + 1 + '&adminId=' + item.zwh_id
            })
        }
    },
    created() {
        this.getData(true);
        window.addEventListener('scroll', this.onScroll);
    },
})