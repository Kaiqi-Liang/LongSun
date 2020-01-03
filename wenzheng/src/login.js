const id = location.href.split('?')[1].split('=')[1]
document.querySelector('.login').addEventListener('click', (event) => {
    event.preventDefault()
    const input = document.getElementsByTagName('input')
    let data = new FormData()
    data.append('appid', id)
    data.append('username', input[0].value)
    data.append('password', input[1].value)

    axios.post('http://www.sogx.cn/api/user/login', data)
    .then(response => {
        if (response.data.msg == '登录成功') {
            console.log(location.href)
            window.location.href = 'guestbook.html?ym_id=' + id
        }
    })
})