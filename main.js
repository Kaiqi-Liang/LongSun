const headers = document.getElementsByClassName("background")
for (let header = 0; header < headers.length; header++) {
    headers[header].addEventListener('click', () => {
        // 把点击项变成蓝色
        headers[header].style = "background-color: #344BFF; color: #ffffff;"
        // 把其他几项换回灰色
        for (let i = 0; i < headers.length; i++) {
            if (header != i) {
                headers[i].style = "background-color: #eeeeef; color: #666666"
            }
        }
    })
}