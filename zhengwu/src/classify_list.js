const API_URL_1 = 'http://v.sogx.cn'
const API_URL_2 = 'http://www.sogx.cn'
const ym_id = location.href.split('?')[1].split('=')[1]
console.log(ym_id)
render(1)

const icons = document.getElementsByClassName('icon')
for (let icon = 0; icon < icons.length; icon++) {
    icons[icon].addEventListener('click', () => {
        if (icons[icon].src.indexOf('active') == -1) { // the onclick icon is not active
            // activate the onclick icon
            icons[icon].src = icons[icon].src.split('.')[0] + '_active.' + icons[icon].src.split('.')[1]

            // deactivate every other icon
            for (let i = 0; i < icons.length; i++) {
                if (icon != i) {
                    if (icons[i].src.indexOf('active') != -1) {
                        icons[i].src = icons[i].src.slice(0, -11) + '.png'
                    }
                }
            }

            const main = document.getElementById('main')
            // clear the current list
            main.removeChild(document.getElementById('ul'))
            render(icon + 1)
        }
    })
}

function render(page) {
    const main = document.getElementById('main')
    const ul = document.createElement('ul')
    const hr = document.getElementById('bar')
    main.appendChild(ul)
    ul.setAttribute('id', 'ul')
    if (page == 4) {
        ul.style = "margin: 0"
        hr.style = "margin: 0"
        fetch(API_URL_2 + '/api/news/column/appid/' + ym_id + '/pid/' + 172)
            .then(response => response.json())
            .then(json => {
                for (data of json.data) {
                    const li = document.createElement('li')
                    li.setAttribute('id', data.id)
                    li.className = "box"
                    ul.appendChild(li)

                    const a = document.createElement('a')
                    a.setAttribute('href', API_URL_2 + '/wap/news/list/appid/' + ym_id + '/columnid/' + data.id)
                    li.appendChild(a)

                    const img = document.createElement('img')
                    img.setAttribute('src', API_URL_2 + data.icon)
                    img.style.width = '30%'
                    a.appendChild(img)

                    const p = document.createElement('p')
                    p.innerText = data.name
                    a.appendChild(p)
                }
            })
    } else {
        hr.style = "margin: 0"
        fetch(API_URL_1 + '/api/zwfw/classify_list/ym_id/' + ym_id + '/type/' + page)
            .then(response => response.json())
            .then(json => {
                for (data in json.data) {
                    if (json.data[data].imgurl) { // if there are icons
                        render_icons(json.data[data])
                    } else {
                        render_list(json.data[data])
                    }
                }
            })
    }
}

function render_icons(data) {
    const li = document.createElement('li')
    li.setAttribute('id', data.id)
    li.className = "icons"
    ul.appendChild(li)

    const a = document.createElement('a')
    a.setAttribute('href', 'project_list.html?id=' + data.id + '&&ym_id=' + ym_id + '&&name=' + data.name + '&&type=icon')
    li.appendChild(a)

    const img = document.createElement('img')
    img.setAttribute('src', API_URL_1 + data.imgurl)
    img.style.width = '30%'
    a.appendChild(img)

    const p = document.createElement('p')
    p.innerText = data.name
    p.style.cssText = "margin-top: 0%; margin-bottom: 30%;"
    a.appendChild(p)
}

function render_list(data) {
    const li = document.createElement('li')
    li.setAttribute('id', data.id)
    li.className = "text"
    ul.appendChild(li)

    const hr = document.createElement('hr')
    hr.id = "line"
    ul.appendChild(hr)

    const a = document.createElement('a')
    a.setAttribute('href', 'project_list.html?id=' + data.id + '&&ym_id=' + ym_id + '&&name=' + data.name + '&&type=list')
    li.appendChild(a)

    const p = document.createElement('p')
    p.innerText = data.name
    a.appendChild(p)
}
