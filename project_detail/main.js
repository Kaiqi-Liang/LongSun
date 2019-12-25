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

/*
const icons = document.getElementsByClassName('icon')
for (let icon = 0; icon < icons.length; icon++) {
    console.log(icons[icon])
    icons[icon].addEventListener('click', (event) => {
        console.log('hello')
        event.preventDefault()
    })
}
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
                })

                // create events for switching categories
                const categories = document.getElementsByClassName('category')
                for (let category = 0; category < categories.length; category++) {
                    categories[category].addEventListener('click', () => {
                        if (categories[category].style.color != 'blue') { // the onclick category is not active
                            // change the onclick category colour to activate it
                            categories[category].style.color = 'blue'
                            // deactivate every other category
                            for (let i = 0; i < categories.length; i++) {
                                if (category != i) {
                                    categories[i].style.color = 'black'
                                }
                            }

                            // clear the current list
                            const main = document.getElementById('main')
                            main.removeChild(document.getElementById('info'))

                            // render the corresponding page to the onclick category
                            if (categories[category].innerText === '办事信息') {
                            } else if (categories[category].innerText === '需交材料') {
                            } else if (categories[category].innerText === '注意事项') {
                                render(data.notice)
                            } else if (categories[category].innerText === '审批条件') {
                                render(data.condition)
                            } else if (categories[category].innerText === '流程图') {
                                const ul = document.createElement('ul')
                                ul.setAttribute('id', 'info')
                                main.appendChild(ul)
                                data.flowchart.forEach(flowchart => {
                                    const li = document.createElement('li')
                                    li.innerText = flowchart
                                    ul.appendChild(li)
                                })
                            }
                        }
                    })
                }
            })
    }
})

function render(data) {
    const info = document.createElement('div')
    info.setAttribute('id', 'info')
    document.getElementById('main').appendChild(info)

    const hr = document.createElement('hr')
    info.appendChild(hr)

    const p = document.createElement('p')
    p.innerText = data
    p.style = 'padding-left: 2%;'
    info.appendChild(p)
}