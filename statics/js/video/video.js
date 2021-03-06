const video_id = parseInt(getQuery().id)
const main = document.querySelector('#main')
const video_area = document.querySelector('#video_area')
const video_wrapper = document.querySelector('#video_wrapper')
const video = document.querySelector('video')
const video_title = document.querySelector('#top>h1')
const video_time = document.querySelector('#top>.time')
const video_playNumber = document.querySelector('#top>.play_number')
const video_danmakuNumber = document.querySelector('#top>.danmaku_number')
const bottom_audienceNumber = document.querySelector('#video_area>.bottom>.info>.audience_number')
const bottom_danmakuNumber = document.querySelector('#video_area>.bottom>.info>.danmaku_number')
const author_avatar = document.querySelector('#author>.avatar')
const author_username = document.querySelector('#author>.username')
const author_statement = document.querySelector('#author>.statement')
const author_button = document.querySelector('#author>button')
const toolbar_likes = document.querySelector('#info>.toolbar>.likes')
const toolbar_coins = document.querySelector('#info>.toolbar>.coins')
const toolbar_saves = document.querySelector('#info>.toolbar>.saves')
const toolbar_shares = document.querySelector('#info>.toolbar>.shares')
const info_description = document.querySelector('#info>.description>p')
const info_tags = document.querySelector('#info>.tags')
const controls_process = document.querySelector('#video_wrapper>.controls>.process')
const controls_process_played = document.querySelector('#video_wrapper>.controls>.process>.played')
const controls_process_icon = document.querySelector('#video_wrapper>.controls>.process>.icon')
const controls_play = document.querySelector('#video_wrapper>.controls>.bottom>.left>img')
const controls_location = document.querySelector('#video_wrapper>.controls>.bottom>.left>.location')
const controls_speed = document.querySelector('#video_wrapper>.controls>.bottom>.right>#speed')
const controls_mute = document.querySelector('#video_wrapper>.controls>.bottom>.right>#mute')
const controls_pip = document.querySelector('#video_wrapper>.controls>.bottom>.right>#pip')
const controls_wide = document.querySelector('#video_wrapper>.controls>.bottom>.right>#wide')
const controls_fullPage = document.querySelector('#video_wrapper>.controls>.bottom>.right>#fullPage')
const controls_fullScreen = document.querySelector('#video_wrapper>.controls>.bottom>.right>#fullScreen')
const danmaku_area = document.querySelector('#video_wrapper>.danmaku_area')
const danmaku_switch = document.querySelector('#video_area>.bottom>.control>.switch')
const danmaku_font_settings = document.querySelector('#video_area>.hover>.font_settings')
const danmaku_font_settings_switch = document.querySelector('#video_area>.bottom>.control>.send>.edit>div')
const danmaku_settings = document.querySelector('#video_area>.hover>.danmaku_settings')
const danmaku_settings_switch = document.querySelector('#video_area>.bottom>.control>.settings')
const danmaku_send = document.querySelector('#video_area>.bottom>.control>.send button')
const danmaku_input = document.querySelector('#video_area>.bottom>.control>.send input')
const danmaku_opacity = document.querySelector('.danmaku_settings>.table>input')
const danmaku_type = {
    'scroll': document.querySelector('.font_settings>.type>.scroll'),
    'top': document.querySelector('.font_settings>.type>.top'),
    'bottom': document.querySelector('.font_settings>.type>.bottom'),
}
const danmaku_filter = {
    'scroll': document.querySelector('.danmaku_settings>.filter>.scroll'),
    'top': document.querySelector('.danmaku_settings>.filter>.top'),
    'bottom': document.querySelector('.danmaku_settings>.filter>.bottom'),
    'colorful': document.querySelector('.danmaku_settings>.filter>.colorful'),
}
const recommend = document.querySelector('#recommend')
const color_input = document.querySelector('.font_settings>.color>.edit>input')
const color_preview = document.querySelector('.font_settings>.color>.edit>div')
const color_list = document.querySelector('.font_settings>.color>.list').children
const comment_avatar = document.querySelector('#comment>.comment-box img')
const comment_input = document.querySelector('#comment>.comment-box textarea')
const comment_button = document.querySelector('#comment>.comment-box button')
const comment_count = document.querySelector('#comment>.count')
const comment_comments = document.querySelector('#comment>.comments')
const up = { data: {} }
let chosen_danmaku_type = 'scroll'

class Danmaku {
    constructor(v) {
        let danmaku = document.createElement('div')
        danmaku.classList.add('danmaku')
        danmaku.classList.add('danmaku-' + v.Type)
        if (v.Color !== 'FFFFFF') danmaku.classList.add('danmaku-colorful')
        danmaku.innerText = v.Value;
        danmaku.danmaku_id = v.Id;
        danmaku.style.color = '#' + v.Color;
        danmaku.style.top = Danmaku.initTop(v.Type)
        danmaku.style.left = Danmaku.initLeft(v.Type)
        danmaku_area.appendChild(danmaku)
        danmaku.onanimationend = () => {
            danmaku_area.removeChild(danmaku)
        }
    }
    static lines = Math.floor((video_wrapper.offsetHeight - 44) / 28) + 1
    static center = video_wrapper.offsetWidth / 2 + 'px'
    static initTop(type) {
        if (type === 'scroll')
            return Math.floor(Math.random() * this.lines) * 28 + "px"
        else if (type === 'top')
            return Math.floor(Math.random() * this.lines / 2) * 28 + "px"
        else
            return Math.floor(Math.random() * this.lines / 2) * 28 + Math.floor(this.lines / 2) * 28 + "px"
    }
    static initLeft(type) {
        if (type === 'scroll')
            return '0'
        else
            return this.center
    }
}

function sendDanmaku() {
    if (user.token === '') {
        alert('请先登录')
        return
    }
    danmaku_send.setAttribute('disabled', 'disabled')
    danmaku_send.textContent = '发送中'
    fetch('https://anonym.ink/api/video/danmaku', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: user.token,
            video_id: video_id,
            value: danmaku_input.value,
            color: color_input.value.substring(1),
            type: chosen_danmaku_type,
            location: Math.floor(video.currentTime)
        })
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
		danmaku_input.value = ''
                new Danmaku(json.data)
                video.addEventListener('timeupdate', () => {
                    if (Math.floor(video.currentTime) === json.data.Location) {
                        if ([...danmaku_area.children].some(element => element.danmaku_id === json.data.Id))
                            return;
                        new Danmaku(json.data);
                    }
                })
            } else {
                alert('发送失败：' + json.data)
            }
            danmaku_send.removeAttribute('disabled')
            danmaku_send.textContent = '发送'
        })

}
function loadRecommend(data) {
    data.forEach(v => {
        let section = document.createElement('section')
        section.innerHTML =
            `<a class="cover" href="/video/?id=${v.Id}"><img alt="${v.Title}" src="${v.Cover}"></a>` +
            `<a class="title" href="/video/?id=${v.Id}">${v.Title}</a>` +
            `<a class="author" href="/space/?id=${v.Author}">${v.User.Username}</a>` +
            `<p class="data"><span class="view_number">${v.Views}</span>` +
            `<span class="like_number">${v.Likes}</span></p>`
        recommend.appendChild(section)
    })
}
function loadDanmakus(danmakus) {
    video.addEventListener('timeupdate', () => {
        danmakus
            .filter(v => Math.floor(video.currentTime) === v.Location)
            .forEach(v => {
                if ([...danmaku_area.children].some(element => element.danmaku_id === v.Id))
                    return;
                new Danmaku(v);
            })
    })
}
function loadTags(tags) {
    tags.forEach(v => {
        let span = document.createElement('span')
        span.textContent = v
        info_tags.appendChild(span)
    })
}
function loadComment(commentData, userData) {
    let section = document.createElement('section')
    section.innerHTML =
        `<a class="avatar" href="/space?id=${userData.Uid}" style="background-image: url(${userData.Avatar});"></a>
        <div class="right">
            <div class="user_info">
                <a class="username" href="/space?id=${userData.Uid}">${userData.Username}</a>
                <span class="level" lv="${getLevel(userData.Exp)}"></span>
            </div>
            <p class="content">${commentData.Value}</p>
            <div class="comment_info">
                <span class="time">${commentData.Time}</span>
                <span class="like"></span>
                <span class="hate"></span>
            </div>
        </div>`
    if (comment_comments.children.length === 0)
        comment_comments.appendChild(section)
    else
        comment_comments.insertBefore(section, comment_comments.children[0])
}
function loadComments(data) {
    data.forEach(v => loadComment(v, v.User))
}
function updateFollowButton([Followers, isFollowing]) {
    if (isFollowing) {
        author_button.classList.add('following')
        author_button.textContent = '已关注 ' + Followers
    } else {
        author_button.classList.remove('following')
        author_button.textContent = '+ 关注 ' + Followers
    }
}
function switchVideoPlayStatus() {
    if (video.paused) {
        video.play()
    } else {
        video.pause()
    }
}
function switchDanmakuStatus() {
    if (danmaku_switch.classList.contains('on')) {
        danmaku_switch.classList.remove('on')
        danmaku_switch.classList.add('off')
        danmaku_area.style.visibility = 'hidden'
    } else {
        danmaku_switch.classList.remove('off')
        danmaku_switch.classList.add('on')
        danmaku_area.style.visibility = 'visible'
    }
}
function switchMuteStatus() {
    if (video.muted) {
        video.muted = false
        controls_mute.src = '/statics/images/video/controls-mute.svg'
        controls_mute.title = '开启静音'
    } else {
        video.muted = true
        controls_mute.src = '/statics/images/video/controls-unmute.svg'
        controls_mute.title = '取消静音'
    }
}
function switchPIPStatus() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture()
    }
}
function switchPlaySpeed() {
    switch (video.playbackRate) {
        case 1:
            video.playbackRate = 1.25
            controls_speed.textContent = '1.25x'
            break;
        case 1.25:
            video.playbackRate = 1.5
            controls_speed.textContent = '1.5x'
            break;
        case 1.5:
            video.playbackRate = 2
            controls_speed.textContent = '2.0x'
            break;
        case 2:
            video.playbackRate = 0.5
            controls_speed.textContent = '0.5x'
            break;
        case 0.5:
            video.playbackRate = 0.75
            controls_speed.textContent = '0.75x'
            break;
        default:
            video.playbackRate = 1
            controls_speed.textContent = '倍速'
            break;
    }
}
function switchVideoSize(size) {
    function setWide() {
        main.classList.add('wide')
        controls_wide.src = '/statics/images/video/controls-wideExit.svg'
        controls_wide.title = '退出宽屏'
    }
    function setFullPage() {
        main.classList.add('fullPage')
        controls_fullPage.src = '/statics/images/video/controls-fullPageExit.svg'
        controls_fullPage.title = '退出网页全屏'
        document.documentElement.style.overflow = 'hidden'
    }
    function exitWide() {
        main.classList.remove('wide')
        controls_wide.src = '/statics/images/video/controls-wide.svg'
        controls_wide.title = '宽屏模式'
    }
    function exitFullPage() {
        main.classList.remove('fullPage')
        controls_fullPage.src = '/statics/images/video/controls-fullPage.svg'
        controls_fullPage.title = '网页全屏'
        document.documentElement.style.overflow = ''
    }
    function setFullScreen() {
        main.classList.add('fullScreen')
        video_wrapper.requestFullscreen()
    }
    function exitFullScreen() {
        main.classList.remove('fullScreen')
        document.exitFullscreen()
    }
    if (main.classList.contains('normal')) {
        main.classList.remove('normal')
        switch (size) {
            case 'wide':
                setWide(); break;
            case 'fullPage':
                setFullPage(); break;
            case 'fullScreen':
                setFullScreen(); break;
        }
    } else if (main.classList.contains('wide')) {
        exitWide()
        switch (size) {
            case 'wide':
                main.classList.add('normal'); break;
            case 'fullPage':
                setFullPage(); break;
            case 'fullScreen':
                setFullScreen(); break;
        }
    } else if (main.classList.contains('fullPage')) {
        exitFullPage()
        switch (size) {
            case 'wide':
                setWide(); break;
            case 'fullPage':
                main.classList.add('normal'); break;
            case 'fullScreen':
                setFullScreen(); break;
        }
    } else if (main.classList.contains('fullScreen')) {
        exitFullScreen()
        switch (size) {
            case 'wide':
                setWide(); break;
            case 'fullPage':
                setFullPage(); break;
            case 'fullScreen':
                main.classList.add('normal'); break;
        }
    }
    danmaku_area.innerHTML = ''
    Danmaku.lines = Math.floor((video_wrapper.offsetHeight - 44) / 28) + 1
    Danmaku.center = video_wrapper.offsetWidth / 2 + 'px'
}
function changeDanmakuType(type) {
    for (let i in danmaku_type) {
        if (i === type) {
            danmaku_type[i].classList.add('chosen')
        } else {
            danmaku_type[i].classList.remove('chosen')
        }
    }
    chosen_danmaku_type = type
}
function changeDanmakuColor(color) {
    color_input.value = rgbToHex(color)
    color_preview.style.backgroundColor = color
}

function rgbToHex(rgb) {
    return '#' + rgb.slice(4, -1).split(', ').map(v => {
        const hex = parseInt(v).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
}
function checkHex(hex) {
    if (hex.length !== 7)
        return false
    if (hex[0] !== '#')
        return false
    return hex.substring(1).every(v => '0123456789ABCDEF'.includes(v))
}
function formatDuration(duration) {
    duration = Math.floor(duration)
    let sec = duration % 60
    let min = (duration - sec) / 60
    if (sec < 10) {
        sec = '0' + sec
    }
    if (min < 10) {
        min = '0' + min
    }
    return `${min}:${sec}`
}
function getQuery() {
    const query = window.location.search.substring(1).split('&').map(v => v.split('=')), json = {}
    query.forEach(v => json[v[0]] = v[1])
    return json
}
function initVideo() {
    fetch('https://anonym.ink/api/video/video?video_id=' + video_id, {
        method: 'GET'
    })
        .then(data => data.json())
        .then(json => new Promise((resolve, reject) => {
            console.log('Video: ', json.data)
            if (!json.status) {
                jumpTo404()
                return
            }
            if (!json.data.Danmakus) json.data.Danmakus = []
            document.title = json.data.Title + '_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili'
            video_title.textContent = json.data.Title
            video_time.textContent = json.data.Time
            video_playNumber.textContent = json.data.Views
            video_danmakuNumber.textContent = json.data.Danmakus.length
            bottom_danmakuNumber.textContent = json.data.Danmakus.length
            toolbar_likes.textContent = json.data.Likes
            toolbar_coins.textContent = json.data.Coins
            toolbar_saves.textContent = json.data.Saves
            toolbar_shares.textContent = json.data.Shares
            info_description.textContent = json.data.Description
            video.src = json.data.Video
            video.poster = json.data.Cover
            loadDanmakus(json.data.Danmakus)
            loadTags(json.data.Label)
            resolve(json.data.Author)
        }))
        .then(UPuid => {
            let p1 = fetch('https://anonym.ink/api/user/info/' + UPuid)
                .then(data => data.json())
                .then(json => new Promise(resolve => {
                    if (json.status) {
                        up.data = json.data
                        author_avatar.style.backgroundImage = `url(${json.data.Avatar})`
                        author_avatar.href = `/space/?id=${json.data.Uid}`
                        author_username.textContent = json.data.Username
                        author_username.href = `/space/?id=${json.data.Uid}`
                        author_statement.textContent = json.data.Statement
                        resolve(json.data.Followers)
                    } else {
                        alert('获取UP信息失败：' + json.data)
                    }
                }))
            let p2 = new Promise(resolve => {
                let uid = null
                if (localStorage.getItem('uid'))
                    uid = localStorage.getItem('uid')
                else if (sessionStorage.getItem('uid'))
                    uid = sessionStorage.getItem('uid')
                if (!uid) {
                    author_button.onclick = function () {
                        alert('请先登录')
                    }
                    resolve(false)
                } else if (uid === UPuid.toString()) {
                    author_button.onclick = function () {
                        alert('你时刻都在关注自己')
                    }
                    resolve(false)
                } else {
                    author_button.onclick = function() {
                        fetch('https://anonym.ink/api/user/follow', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: jsonToQuery({
                                uid: up.data.Uid,
                                token: user.token
                            })
                        })
                            .then(data => data.json())
                            .then(json => {
                                if (json.status) {
                                    up.data.Followers += json.data ? 1 : -1
                                    updateFollowButton([up.data.Followers, json.data])
                                } else {
                                    console.log('关注/取消关注失败：', json.data)
                                }
                            })
                    }
                    fetch('https://anonym.ink/api/user/follow?' + jsonToQuery({
                        a: uid,
                        b: UPuid
                    }))
                        .then(data => data.json())
                        .then(json => {
                            if (json.status) {
                                if (json.data > 0)
                                    resolve(true)
                                else
                                    resolve(false)
                            } else {
                                console.log('获取关注信息失败：', json.data)
                                resolve(false)
                            }
                        })
                }
            })
            Promise.all([p1, p2]).then(data => updateFollowButton(data))
        })
    fetch('https://anonym.ink/api/video/recommend?video_id=' + video_id)
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                loadRecommend(json.data)
            } else {
                console.log("获取推荐视频失败：", json.data)
            }
        })
    let body =
        user.token === '' ? {
            video_id: video_id
        } : {
            video_id: video_id,
            token: user.token
        }
    fetch('https://anonym.ink/api/video/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: jsonToQuery(body)
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                console.log('增加播放次数成功')
                if (json.data === '') return
                if (json.data === 'SUCCESS')
                    console.log("每日浏览任务成功：SUCCESS")
                else if (json.data === 'ALREADY_DONE')
                    console.log("每日浏览任务失败：ALREADY_DONE")
            } else {
                console.log('增加播放次数失败：' + json.data)
            }
        })
    fetch('https://anonym.ink/api/video/comments?video_id=' + video_id)
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                if (json.data === null) {
                    comment_count.textContent = '0'
                } else {
                    comment_count.textContent = json.data.length
                    loadComments(json.data)
                }
            } else {
                console.log("加载评论失败：", json.data)
            }
        })
    
    if (user.token === '') return
    fetch('https://anonym.ink/api/video/like?video_id=' + video_id + '&token=' + user.token, {
        method: 'GET',
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                if (json.data) {
                    toolbar_likes.classList.add('done')
                } else {
                    toolbar_likes.classList.remove('done')
                }
            } else {
                console.log('获取点赞状态失败：' + json.data)
            }
        })
    fetch('https://anonym.ink/api/video/coin?video_id=' + video_id + '&token=' + user.token, {
        method: 'GET',
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                if (json.data) {
                    toolbar_coins.classList.add('done')
                } else {
                    toolbar_coins.classList.remove('done')
                }
            } else {
                console.log('获取投币状态失败：' + json.data)
            }
        })
}

function init() {
    initVideo()
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            controls_fullScreen.title = '退出全屏'
        } else {
            controls_fullScreen.title = '进入全屏'
            if (main.getAttribute('class') === 'fullScreen') {
                main.setAttribute('class', 'normal');
            }
        }
        Danmaku.lines = Math.floor((video_wrapper.offsetHeight - 44) / 28) + 1
        Danmaku.center = video_wrapper.offsetWidth / 2 + 'px'
    })
    video.addEventListener('canplay', () => {
        controls_location.children[2].innerText = formatDuration(video.duration)
    })
    video.addEventListener('click', switchVideoPlayStatus)
    video.addEventListener('play', () => {
        video_area.classList.remove('paused')
        controls_play.setAttribute('src', '/statics/images/video/controls-pause.svg')
    })
    video.addEventListener('pause', () => {
        video_area.classList.add('paused')
        controls_play.setAttribute('src', '/statics/images/video/controls-play.svg')
    })
    video.addEventListener('timeupdate', () => {
        if (video.currentTime === 0) danmaku_area.innerHTML = ''
        const ratio = video.currentTime / video.duration
        controls_process_played.style.width = ratio * 100 + '%'
        controls_location.children[0].innerText = formatDuration(video.currentTime)
        controls_process_icon.style.left = `calc(${ratio * 100}% - 11px)`
    })
    video.addEventListener('enterpictureinpicture', () => controls_pip.title = '关闭画中画')
    video.addEventListener('leavepictureinpicture', () => controls_pip.title = '开启画中画')
    controls_play.addEventListener('click', switchVideoPlayStatus)
    danmaku_switch.addEventListener('click', switchDanmakuStatus)
    danmaku_font_settings_switch.addEventListener('mouseover', () => danmaku_font_settings.style.visibility = 'visible')
    danmaku_font_settings_switch.addEventListener('mouseout', () => danmaku_font_settings.style.visibility = 'hidden')
    danmaku_font_settings.addEventListener('mouseover', () => danmaku_font_settings.style.visibility = 'visible')
    danmaku_font_settings.addEventListener('mouseout', () => danmaku_font_settings.style.visibility = 'hidden')
    danmaku_settings_switch.addEventListener('mouseover', () => danmaku_settings.style.visibility = 'visible')
    danmaku_settings_switch.addEventListener('mouseout', () => danmaku_settings.style.visibility = 'hidden')
    danmaku_settings.addEventListener('mouseover', () => danmaku_settings.style.visibility = 'visible')
    danmaku_settings.addEventListener('mouseout', () => danmaku_settings.style.visibility = 'hidden')
    danmaku_send.addEventListener('click', sendDanmaku)
    danmaku_opacity.addEventListener('input', () => {
        danmaku_area.style.opacity = 100 - danmaku_opacity.value + '%'
        danmaku_opacity.style.background =
            `linear-gradient(90deg, #00A1D6 ${danmaku_opacity.value}%, #505050 ${danmaku_opacity.value}%)`
    })
    controls_process.addEventListener('click', e => {
        let player_ratio = e.offsetX / controls_process.offsetWidth
        video.currentTime = player_ratio * video.duration
        danmaku_area.innerHTML = ''
    })
    controls_speed.addEventListener('click', switchPlaySpeed)
    controls_mute.addEventListener('click', switchMuteStatus)
    controls_pip.addEventListener('click', switchPIPStatus)
    controls_wide.addEventListener('click', () => switchVideoSize('wide'))
    controls_fullPage.addEventListener('click', () => switchVideoSize('fullPage'))
    controls_fullScreen.addEventListener('click', () => switchVideoSize('fullScreen'))
    color_input.addEventListener('input', () => {
        color_input.value = color_input.value.toUpperCase()
        color_preview.style.backgroundColor = checkHex(color_input.value) ? color_input.value : 'rgba(0,0,0,0)';
    })
    toolbar_likes.addEventListener('click', () => {
        if (user.token === '') {
            alert('请先登录')
            return
        }
        fetch('https://anonym.ink/api/video/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery({
                video_id: video_id,
                token: user.token
            })
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    if (json.data) {
                        toolbar_likes.classList.add('done')
                        toolbar_likes.textContent = parseInt(toolbar_likes.textContent) + 1
                    } else {
                        toolbar_likes.classList.remove('done')
                        toolbar_likes.textContent = parseInt(toolbar_likes.textContent) - 1
                    }
                } else {
                    if (toolbar_likes.classList.contains('done')) {
                        alert('取消点赞失败：' + json.data)
                    } else {
                        alert('点赞失败：' + json.data)
                    }
                }
            })
    })
    toolbar_coins.addEventListener('click', () => {
        if (user.token === '') {
            alert('请先登录')
            return
        }
        fetch('https://anonym.ink/api/video/coin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery({
                video_id: video_id,
                token: user.token
            })
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    toolbar_coins.classList.add('done')
                    if (json.data) {
                        alert('投币成功！')
                        toolbar_coins.textContent = parseInt(toolbar_coins.textContent) + 1
                    }
                } else {
                    alert('投币失败：' + json.data)
                }
            })
    })
    comment_button.addEventListener('click', () => {
        if (user.token === '') {
            alert('请先登录')
            return
        }
        comment_button.setAttribute('disabled', 'disabled')
        comment_button.textContent = '提交中...'
        fetch('https://anonym.ink/api/video/comment', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery({
                token: user.token,
                video_id: video_id,
                comment: comment_input.value
            })
        })
            .then(data => data.json())
            .then(json => {
                comment_button.removeAttribute('disabled')
                comment_button.textContent = '发表评论'
                if (json.status) {
                    alert('评论成功！')
                    loadComment(json.data, user.data)
                } else {
                    alert('评论失败：' + json.data)
                }
            })
    })
    for (let i in danmaku_type)
        danmaku_type[i].addEventListener('click', () => changeDanmakuType(i));
    for (let i in danmaku_filter)
        danmaku_filter[i].addEventListener('click', () => {
            if (danmaku_filter[i].classList.contains('filter')) {
                danmaku_filter[i].classList.remove('filter')
                main.classList.remove('danmaku-filter-' + i)
            } else {
                danmaku_filter[i].classList.add('filter')
                main.classList.add('danmaku-filter-' + i)
            }
        });
    for (let v of color_list)
        v.addEventListener('click', () => changeDanmakuColor(v.style.backgroundColor));
}

init()
tokenInit.then(() => {
    if (user.token === '') return
    comment_avatar.src = user.data.Avatar
})
