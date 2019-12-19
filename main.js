const images = document.getElementsByClassName("image")
for (let image = 0; image < images.length; image++) {
    images[image].addEventListener('click', () => {
        // 如果点击项不是蓝色就把它变成蓝色
        if (images[image].src.indexOf('active') === -1) {
            images[image].src = images[image].src.split('.')[0] + '_active.' + images[image].src.split('.')[1]
        }

        // 把其他几项换回灰色
        for (let i = 0; i < images.length; i++) {
            if (image != i) {
                if (images[i].src.indexOf('active') !== -1) {
                    //console.log(images[i].src.slice(0, -11))
                    images[i].src = images[i].src.slice(0, -11) + '.png'
                }
            }
        }
    })
}