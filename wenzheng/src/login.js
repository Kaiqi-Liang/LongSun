const API_URL = 'http://test.sogx.cn'
const id = location.href.split('?')[1].split('=')[1]
document.querySelector('.login').addEventListener('click', (event) => {
    event.preventDefault()
    const input = document.getElementsByTagName('input')
    if (!input[0].value) {
        layer.msg('请输入用户名', {offset: 'b'})
    } else if (!input[1].value) {
        layer.msg('请输入密码', {offset: 'b'})
    } else {
        const modal = document.querySelector('.modal')
        modal.style.display = 'block'
 
        const data = new FormData(document.getElementById('form'))
        data.append('appid', id)
        const options = {
            method: 'POST',
            body: data
        }
        fetch(API_URL + '/api/user/login', options)
            .then(response => response.json())
            .then(json => {
                layer.msg(json.msg, { offset: 'b' })
                setTimeout(() => {
                    modal.style.display = 'none'
                    if (json.msg == '登录成功') history.go(-1)
                }, 500)
            })
    }
})