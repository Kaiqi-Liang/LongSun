const API_URL = 'http://v.sogx.cn'
const icons = document.getElementsByClassName("icon")
for (let icon = 0; icon < icons.length; icon++) {
    icons[icon].addEventListener('click', () => {
        // 如果点击项不是蓝色
        if (icons[icon].src.indexOf('active') === -1) {
            icons[icon].src = icons[icon].src.split('.')[0] + '_active.' + icons[icon].src.split('.')[1]

            // 把其他几项换回灰色
            for (let i = 0; i < icons.length; i++) {
                if (icon != i) {
                    if (icons[i].src.indexOf('active') !== -1) {
                        icons[i].src = icons[i].src.slice(0, -11) + '.png'
                    }
                }
            }

            const root = document.getElementById('root')
            // 清除当前列表
            root.removeChild(document.getElementById('ul'))
        }
    })
}

new Vue({
    el: '#root',
    mounted() {
        const root = document.getElementById('root')
        const ul = document.createElement('ul')
        root.appendChild(ul)
        ul.setAttribute('id', 'ul')
        axios.get(API_URL + "/api/zwfw/classify_list/ym_id/48/type/1").then(response => {
            for (icon in response.data.data) {
                const li = document.createElement('li')
                ul.appendChild(li)
                const img = document.createElement('img')
                img.setAttribute('src', API_URL + response.data.data[icon].imgurl)
                const p = document.createElement('p')
                p.innerText = response.data.data[icon].name
                li.appendChild(img)
                li.appendChild(p)
            }
        })
    }
})