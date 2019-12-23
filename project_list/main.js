fetch('http://v.sogx.cn/api/zwfw/project_list_new/ym_id/48/classifyType/39/page/1')
    .then(response => response.json())
    .then(json => {
        console.log(json)
    })
fetch('http://v.sogx.cn/api/zwfw/classify_list/ym_id/48/type/3')
    .then(response => response.json())
    .then(json => {
        console.log(json)
    })
fetch('http://v.sogx.cn/api/zwfw/project_detail/ym_id/48/id/1230')
    .then(response => response.json())
    .then(json => {
        console.log(json)
    })