const API_URL_1 = 'http://v.sogx.cn'
const API_URL_2 = 'http://www.sogx.cn'
const ym_id = location.href.split('?')[1].split('=')[1]
render(1)

const icons = document.getElementsByName('icon')
for (let icon = 0; icon < icons.length; icon++) {
    icons[icon].addEventListener('click', () => {
        if (icons[icon].src.indexOf('active') == -1) { // the onclick icon is not active
            // activate the onclick icon
            icons[icon].src = icons[icon].src.slice(0, icons[icon].src.lastIndexOf('.')) + '_active.png'

            for (let i = 0; i < icons.length; i++) { // loop through every other icon
                if (icon != i) {
                    if (icons[i].src.indexOf('active') >= 0) { // find the last active icon
                        // deactivate it
                        icons[i].src = icons[i].src.slice(0, icons[i].src.indexOf('_active')) + '.png'
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
    main.appendChild(ul)
    ul.setAttribute('id', 'ul')
    if (page == 4) {
        ul.style = "margin: 0"
        fetch(API_URL_2 + '/api/news/column/appid/' + ym_id + '/pid/' + 172)
            .then(response => response.json())
            .then(json => {
                for (data of json.data) {
                    const li = document.createElement('li')
                    ul.appendChild(li)

                    li.setAttribute('id', data.id)
                    li.className = "box"
                    const link = API_URL_2 + '/wap/news/list/appid/' + ym_id + '/columnid/' + data.id
                    li.onclick = () => top.location.href = link

                    const img = document.createElement('img')
                    img.setAttribute('src', API_URL_2 + data.icon)
                    img.style.width = '30%'
                    li.appendChild(img)

                    const p = document.createElement('p')
                    p.innerText = data.name
                    li.appendChild(p)
                }
            })
    } else {
        fetch(API_URL_1 + '/api/zwfw/classify_list/ym_id/' + ym_id + '/type/' + page)
            .then(response => response.json())
            .then(json => {
                for (data of json.data) {
                    if (data.imgurl) { // if there are icons
                        render_icons(data, 'project_list.html?id=' + data.id + '&ym_id=' + ym_id + '&name=' + data.name + '&type=icon')
                    } else {
                        render_list(data, 'project_list.html?id=' + data.id + '&ym_id=' + ym_id + '&name=' + data.name + '&type=list')
                    }
                }
            })
    }
}

function render_icons(data, link) {
    const li = document.createElement('li')
    ul.appendChild(li)

    li.className = "icon"
    li.setAttribute('id', data.id)
    li.onclick = () => top.location.href = link

    const img = document.createElement('img')
    img.setAttribute('src', API_URL_1 + data.imgurl)
    img.style.width = '30%'
    li.appendChild(img)

    const p = document.createElement('p')
    p.innerText = data.name
    p.style.cssText = "margin-top: 0%; margin-bottom: 30%;"
    li.appendChild(p)
}

function render_list(data, link) {
    const li = document.createElement('li')
    ul.appendChild(li)

    li.className = "text"
    li.setAttribute('id', data.id)
    li.onclick = () => top.location.href = link

    const hr = document.createElement('hr')
    hr.id = "line"
    ul.appendChild(hr)

    const p = document.createElement('p')
    p.innerText = data.name
    li.appendChild(p)
}
