const API_URL = 'http://v.sogx.cn'
render(1)
/*
const home = new Promise((resovle) => {
    setTimeout(() => {
        resovle()
    }, 100)
    render(1)
})
home.then(() => {
    document.querySelectorAll('.icons').forEach(icon => {
        console.log(icon)
    })
})
*/

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
    main.appendChild(ul)
    ul.setAttribute('id', 'ul')
    fetch(API_URL + "/api/zwfw/classify_list/ym_id/48/type/" + page)
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

function render_icons(data) {
    const li = document.createElement('li')
    li.setAttribute('id', data.id)
    li.className = "icons"
    ul.appendChild(li)

    const a = document.createElement('a')
    a.setAttribute('href', '../project_list/index.html?id=' + data.id + '&&name=' + data.name + '&&type=icon')
    li.appendChild(a)

    const img = document.createElement('img')
    img.setAttribute('src', API_URL + data.imgurl)
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
    a.setAttribute('href', '../project_list/index.html?id=' + data.id + '&&name=' + data.name + '&&type=list')
    li.appendChild(a)

    const p = document.createElement('p')
    p.innerText = data.name
    a.appendChild(p)
}
