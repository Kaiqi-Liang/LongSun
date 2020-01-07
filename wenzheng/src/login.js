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
        axios.post('http://www.sogx.cn/api/user/login', data)
            .then(response => {
                layer.msg(response.data.msg, { offset: 'b' })
                setTimeout(() => {
                    modal.style.display = 'none'
                    if (response.data.msg == '登录成功') window.location.href = 'guestbook.html?ym_id=' + id
                }, 500)
            })
    }
})