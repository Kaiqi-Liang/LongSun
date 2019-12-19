const icons = document.getElementsByClassName("icon")
for (let icon = 0; icon < icons.length; icon++) {
    icons[icon].addEventListener('click', () => {
        // 如果点击项不是蓝色就把它变成蓝色
        if (icons[icon].src.indexOf('active') === -1) {
            icons[icon].src = icons[icon].src.split('.')[0] + '_active.' + icons[icon].src.split('.')[1]
        }

        // 把其他几项换回灰色
        for (let i = 0; i < icons.length; i++) {
            if (icon != i) {
                if (icons[i].src.indexOf('active') !== -1) {
                    //console.log(icons[i].src.slice(0, -11))
                    icons[i].src = icons[i].src.slice(0, -11) + '.png'
                }
            }
        }
    })
}