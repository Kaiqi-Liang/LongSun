const API_URL = 'http://v.sogx.cn'
render(1)

const icons = document.getElementsByClassName('icon')
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

            const main = document.getElementById('main')
            // 清除当前列表
            main.removeChild(document.getElementById('ul'))
            render(icon + 1)
        }
    })
}

function render(page) {
    const main = document.getElementById('main')
    const ul = document.createElement('ul')
    main.appendChild(ul)
    ul.setAttribute('id', 'ul')
    fetch(API_URL + "/api/zwfw/classify_list/ym_id/48/type/" + page)
        .then(response => response.json())
        .then(json => {
            for (data in json.data) {
                if (json.data[data].imgurl) {
                    const li = document.createElement('li')
                    li.setAttribute('id', json.data[data].id)
                    li.className = "icons"
                    ul.appendChild(li)

                    const a = document.createElement('a')
                    a.setAttribute('href', '')
                    li.appendChild(a)

                    const img = document.createElement('img')
                    img.setAttribute('src', API_URL + json.data[data].imgurl)
                    img.style.width = '30%'
                    a.appendChild(img)

                    const p = document.createElement('p')
                    p.innerText = json.data[data].name
                    p.style.cssText = "margin-top: 0%; margin-bottom: 30%;"
                    a.appendChild(p)
                } else {
                    const li = document.createElement('li')
                    li.setAttribute('id', json.data[data].id)
                    li.className = "text"
                    ul.appendChild(li)

                    const hr = document.createElement('hr')
                    hr.id = "line"
                    ul.appendChild(hr)

                    const a = document.createElement('a')
                    a.setAttribute('href', '')
                    li.appendChild(a)

                    const p = document.createElement('p')
                    p.innerText = json.data[data].name
                    a.appendChild(p)
                }
            }
        })
}