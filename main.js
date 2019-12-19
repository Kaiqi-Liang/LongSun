for (let header in document.getElementsByClassName("header")) {
    header.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active')
        header.classList.add('active')
    })
}